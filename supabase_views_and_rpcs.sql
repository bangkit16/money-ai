-- ==========================================================
-- SUPABASE OPTIMIZATION: VIEWS & RPCS FOR MONEY-AI
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- ==========================================================

-- 1. VIEW TRANSAKSI LENGKAP (Join Akun & Kategori)
create or replace view public.v_transactions
with (security_invoker = true) as
select
  t.id,
  t.created_at,
  coalesce(t.transaction_date, t.created_at) as transaction_date,
  t.transaction,
  t.amount,
  t.transaction_type,
  t.user_id,
  t.category_id,
  t.account_id,
  t.to_account_id,
  case when t.category_id is not null then
    jsonb_build_object(
      'id', c.id,
      'category', c.category,
      'category_en', c.category_en,
      'slug', c.slug,
      'icon', c.icon
    )
  else null end as category,
  case when t.account_id is not null then
    jsonb_build_object(
      'id', fa.id,
      'account_name', fa.account_name,
      'exclude_from_total', fa.exclude_from_total
    )
  else null end as from_account,
  case when t.to_account_id is not null then
    jsonb_build_object(
      'id', ta.id,
      'account_name', ta.account_name,
      'exclude_from_total', ta.exclude_from_total
    )
  else null end as to_account
from public.transaction t
left join public.category_transaction c on c.id = t.category_id
left join public.account fa on fa.id = t.account_id
left join public.account ta on ta.id = t.to_account_id;

-- 2. VIEW REKENING & SALDO OTOMATIS
create or replace view public.v_account_with_totals
with (security_invoker = true) as
select
  a.id,
  a.user_id,
  a.account_name,
  a.is_primary,
  a.exclude_from_total,
  a.created_at,
  coalesce(
    (
      select coalesce(sum(
        case
          when t.transaction_type = 'INCOME' then t.amount
          when t.transaction_type in ('EXPENSE', 'TRANSFER') then -t.amount
          else 0
        end
      ), 0)
      from public.transaction t
      where t.account_id = a.id
    )
    +
    (
      select coalesce(sum(t.amount), 0)
      from public.transaction t
      where t.to_account_id = a.id
        and t.transaction_type = 'TRANSFER'
    ),
    0
  ) as total_amount
from public.account a;

-- 3. RPC DASHBOARD SUMMARY (Net Worth, Pemasukan & Pengeluaran Bulan Ini/Lalu)
drop function if exists public.get_dashboard_summary();
create or replace function public.get_dashboard_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_month_start timestamptz := date_trunc('month', now());
  v_prev_month_start timestamptz := date_trunc('month', now() - interval '1 month');
  v_net_worth numeric := 0;
  v_this_income numeric := 0;
  v_this_expense numeric := 0;
  v_prev_income numeric := 0;
  v_prev_expense numeric := 0;
  v_trend_pct numeric := 0;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  -- Net worth total saldo dari rekening yang tidak di-exclude
  select coalesce(sum(total_amount), 0)
  into v_net_worth
  from public.v_account_with_totals
  where user_id = v_user_id and exclude_from_total = false;

  -- Transaksi bulan ini (hanya rekening non-exclude)
  select
    coalesce(sum(case when t.transaction_type = 'INCOME' then t.amount else 0 end), 0),
    coalesce(sum(case when t.transaction_type = 'EXPENSE' then t.amount else 0 end), 0)
  into v_this_income, v_this_expense
  from public.transaction t
  left join public.account a on a.id = t.account_id
  where t.user_id = v_user_id
    and coalesce(a.exclude_from_total, false) = false
    and coalesce(t.transaction_date, t.created_at) >= v_month_start;

  -- Transaksi bulan lalu (hanya rekening non-exclude)
  select
    coalesce(sum(case when t.transaction_type = 'INCOME' then t.amount else 0 end), 0),
    coalesce(sum(case when t.transaction_type = 'EXPENSE' then t.amount else 0 end), 0)
  into v_prev_income, v_prev_expense
  from public.transaction t
  left join public.account a on a.id = t.account_id
  where t.user_id = v_user_id
    and coalesce(a.exclude_from_total, false) = false
    and coalesce(t.transaction_date, t.created_at) >= v_prev_month_start
    and coalesce(t.transaction_date, t.created_at) < v_month_start;

  if (v_prev_income - v_prev_expense) <> 0 then
    v_trend_pct := round((((v_this_income - v_this_expense) - (v_prev_income - v_prev_expense)) / abs(v_prev_income - v_prev_expense)) * 100, 1);
  elsif (v_this_income - v_this_expense) <> 0 then
    v_trend_pct := 100;
  else
    v_trend_pct := 0;
  end if;

  return json_build_object(
    'net_worth', v_net_worth,
    'this_month_income', v_this_income,
    'this_month_expense', v_this_expense,
    'prev_month_income', v_prev_income,
    'prev_month_expense', v_prev_expense,
    'trend_pct', v_trend_pct
  );
end;
$$;

-- 4. RPC ANALYTICS BULANAN (Per Kategori & Persentase)
drop function if exists public.get_monthly_analytics(text, int);
create or replace function public.get_monthly_analytics(
  p_type text default 'EXPENSE',
  p_month_offset int default 0
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_start timestamptz := date_trunc('month', now() + (p_month_offset || ' month')::interval);
  v_end timestamptz := v_start + interval '1 month';
  v_total numeric := 0;
  v_categories json;
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select coalesce(sum(t.amount), 0)
  into v_total
  from public.transaction t
  where t.user_id = v_user_id
    and t.transaction_type = p_type
    and coalesce(t.transaction_date, t.created_at) >= v_start
    and coalesce(t.transaction_date, t.created_at) < v_end;

  select coalesce(json_agg(cat_row), '[]'::json)
  into v_categories
  from (
    select
      coalesce(c.id, -1) as id,
      coalesce(c.category, 'Lainnya') as name,
      c.category_en,
      coalesce(c.icon, 'more-horiz') as icon,
      sum(t.amount) as amount,
      case when v_total > 0 then round((sum(t.amount) / v_total) * 100, 1) else 0 end as percent
    from public.transaction t
    left join public.category_transaction c on c.id = t.category_id
    where t.user_id = v_user_id
      and t.transaction_type = p_type
      and coalesce(t.transaction_date, t.created_at) >= v_start
      and coalesce(t.transaction_date, t.created_at) < v_end
    group by c.id, c.category, c.category_en, c.icon
    order by sum(t.amount) desc
  ) cat_row;

  return json_build_object(
    'total', v_total,
    'categories', v_categories
  );
end;
$$;

-- Permissions
grant select on public.v_transactions to authenticated;
grant select on public.v_account_with_totals to authenticated;
grant execute on function public.get_dashboard_summary() to authenticated;
grant execute on function public.get_monthly_analytics(text, int) to authenticated;
