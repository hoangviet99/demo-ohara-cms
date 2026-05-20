
import type { ReactNode } from "react";

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

interface IconWrapperProps extends IconProps {
  children: ReactNode;
  viewBox?: string;
}

export const IconWrapper = ({
  children,
  className = "",
  size = 24,
  color = "currentColor",
  viewBox = "0 0 24 24",
}: IconWrapperProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
};

export { BellIcon } from "./BellIcon";
export { ChevronDownIcon } from "./ChevronDownIcon";
export { ChevronLeftIcon } from "./ChevronLeftIcon";
export { EyeIcon } from "./EyeIcon";
export { FolderOpenIcon } from "./FolderOpenIcon";
export { ImageIcon } from "./ImageIcon";
export { LayoutDashboardIcon } from "./LayoutDashboardIcon";
export { LogOutIcon } from "./LogOutIcon";
export { PackageIcon } from "./PackageIcon";
export { PencilIcon } from "./PencilIcon";
export { SearchIcon } from "./SearchIcon";
export { SettingsIcon } from "./SettingsIcon";
export { ShoppingBagIcon } from "./ShoppingBagIcon";
export { ShoppingCartIcon } from "./ShoppingCartIcon";
export { SpinnerIcon } from "./SpinnerIcon";
export { TrashIcon } from "./TrashIcon";
export { UserGroupIcon } from "./UserGroupIcon";
export { UserIcon } from "./UserIcon";
