'use client';

import Link from 'next/link';
import { ReactNode, MouseEvent, useState } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ripple?: boolean;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  ripple = true,
}: ButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-xl hover:scale-105 hover-shine',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-lg hover:scale-105',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:scale-105',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleRipple = (e: MouseEvent<HTMLElement>) => {
    if (!ripple) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    handleRipple(e);
    if (onClick) {
      onClick();
    }
  };

  const rippleElements = ripples.map((ripple) => (
    <span
      key={ripple.id}
      className="ripple"
      style={{
        left: ripple.x,
        top: ripple.y,
        width: 10,
        height: 10,
      }}
    />
  ));

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClassName}
        onClick={handleClick}
      >
        {rippleElements}
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={buttonClassName}
    >
      {rippleElements}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
