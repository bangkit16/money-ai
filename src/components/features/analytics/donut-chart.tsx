// migrated to useColor
import { useColor } from "@/hooks/useColor";
import Svg, { Circle } from "react-native-svg";

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  size?: number;
  strokeWidth?: number;
  segments?: DonutSegment[];
};

export function DonutChart({
  size = 200,
  strokeWidth = 18,
  segments = [],
}: DonutChartProps) {
  const trackColor = useColor("surfaceContainer");
  const radiusPx = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusPx;

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radiusPx}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circumference;
        const cumulativePercent = segments
          .slice(0, i)
          .reduce((sum, s) => sum + s.value, 0);
        const offset =
          circumference - (cumulativePercent / 100) * circumference;
        return (
          <Circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radiusPx}
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={offset}
            fill="transparent"
            strokeLinecap="butt"
          />
        );
      })}
    </Svg>
  );
}