interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const CustomButton = ({ children, onClick, className = "" }: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
};
