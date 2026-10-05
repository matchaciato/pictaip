import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'model';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  customColor?: {
    bg: string;
    text: string;
    border: string;
  };
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
  primary:
    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  success:
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  info:
    'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  model:
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  customColor,
  icon,
  className = '',
  children,
  ...props
}) => {
  const customClass = customColor
    ? `${customColor.bg} ${customColor.text} ${customColor.border}`
    : variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border backdrop-blur-sm select-none ${customClass} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
