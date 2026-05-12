interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const CustomButton = ({ children, onClick, className = "", type = "button", disabled = false }: CustomButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
