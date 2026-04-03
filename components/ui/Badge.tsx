import { BADGE_STYLES } from "@/constants/categoryStyles";
import type { BadgeProps } from "@/types/components";

const Badge = ({ category, label }: BadgeProps) => {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_STYLES[category]}`}
    >
      {label}
    </span>
  );
};

export default Badge;
