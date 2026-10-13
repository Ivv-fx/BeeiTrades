import React, { useRef, useState, type MouseEvent, type ReactNode } from "react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
  children: ReactNode;
  onClick?: () => void;
  glowColor?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  hoverBackgroundColor?: string;
}

const HoverButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  glowColor = "#00ffc3",
  backgroundColor = "#111827",
  textColor = "#ffffff",
  hoverTextColor = "#67e8f9",
  hoverBackgroundColor,
  type = "button",
  ...buttonProps
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setGlowPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`nav-glow-button relative inline-block px-8 py-4 border-none cursor-pointer overflow-hidden transition-colors duration-300 text-xl rounded-lg z-10 font-sans ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        ...buttonProps.style,
        backgroundColor: isHovered && hoverBackgroundColor ? hoverBackgroundColor : backgroundColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 transition-transform duration-400 ease-out ${isHovered ? "scale-120" : "scale-0"}`}
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 10%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export { HoverButton };
