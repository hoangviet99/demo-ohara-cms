import React from "react";
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
