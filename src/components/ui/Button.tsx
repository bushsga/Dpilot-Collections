import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 font-medium text-sm tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-accent text-white hover:bg-brand-primary',
    secondary: 'bg-brand-primary text-white hover:bg-brand-accent',
    outline: 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;