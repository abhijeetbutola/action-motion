import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "secondary";
}

const baseStyles =
  "px-4 py-2 rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  secondary: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={[baseStyles, variantStyles[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
