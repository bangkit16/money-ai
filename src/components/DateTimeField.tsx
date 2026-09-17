// Field tanggal & waktu terpisah agar pemilihan jam eksplisit (bukan tersembunyi di alur "Next").
import { DatePicker } from "@/components/ui/date-picker";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

export function DateField({ value, onChange }: Props) {
  return <DatePicker mode="date" value={value} onChange={(v) => v && onChange(v)} />;
}

export function TimeField({ value, onChange }: Props) {
  return <DatePicker mode="time" value={value} onChange={(v) => v && onChange(v)} />;
}
