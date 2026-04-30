import { ReactNode } from 'react';

const COLORS: Record<string, string> = {
  nature: 'bg-green-100 text-green-800',
  adventure: 'bg-orange-100 text-orange-800',
  waterfalls: 'bg-blue-100 text-blue-800',
  caves: 'bg-purple-100 text-purple-800',
  culture: 'bg-amber-100 text-amber-800',
  low: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

interface BadgeProps {
  label: string;
  children?: ReactNode;
  className?: string;
}

export default function Badge({ label, children, className = '' }: BadgeProps) {
  const color = COLORS[label.toLowerCase()] ?? COLORS.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color} ${className}`}>
      {children ?? label}
    </span>
  );
}
