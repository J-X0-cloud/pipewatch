import { ICONS, type IconName } from "./icons";

interface IconProps {
  name: IconName;
  size?: number;
  /** Decorative by default; pass a label for icons that carry meaning on their own. */
  label?: string;
}

export function Icon({ name, size, label }: IconProps) {
  const { strokeWidth, paths } = ICONS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {paths}
    </svg>
  );
}
