// migrated to useColor
import { radius, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function DateTimeField({ value, onChange }: Props) {
  const bgColor = useColor("card");
  const textColor = useColor("text");
  const cardColor = useColor("card");
  return (
    <input
      type="datetime-local"
      value={toLocalInputValue(value)}
      onChange={(e) => {
        const next = new Date(e.target.value);
        if (!isNaN(next.getTime())) onChange(next);
      }}
      style={{
        backgroundColor: cardColor,
        borderRadius: radius.lg,
        border: "none",
        outline: "none",
        padding: "12px 16px",
        fontSize: typography.bodySm.fontSize,
        fontFamily: "inherit",
        color: textColor,
        width: "100%",
        boxSizing: "border-box",
      }}
    />
  );
}