// migrated to useColor
import { DatePicker } from "@/components/ui/date-picker";
import { useColor } from "@/hooks/useColor";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function DateTimeField({ value, onChange }: Props) {
  const textColor = useColor("text");
  return (
    <DatePicker
      mode="datetime"
      value={value}
      onChange={(v) => v && onChange(v)}
      style={{ color: textColor }}
    />
  );
}
