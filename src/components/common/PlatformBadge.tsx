import React from 'react';
import { PlatformId } from '../../types';
import { ShoppingBag, UtensilsCrossed, Pizza, Package, Car, Shirt, Tag } from 'lucide-react';

interface PlatformBadgeProps {
  platform: PlatformId | string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  showName = true,
  size = 'md',
}) => {
  const norm = platform.toLowerCase();

  let bg = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <ShoppingBag className="w-4 h-4" />;
  let label = platform;

  if (norm.includes('shopify')) {
    bg = 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60';
    icon = <ShoppingBag className="w-4 h-4 text-emerald-400" />;
    label = 'Shopify';
  } else if (norm.includes('swiggy')) {
    bg = 'bg-orange-950/60 text-orange-400 border-orange-800/50';
    icon = <UtensilsCrossed className="w-4 h-4" />;
    label = 'Swiggy';
  } else if (norm.includes('amazon')) {
    bg = 'bg-amber-950/60 text-amber-400 border-amber-800/50';
    icon = <ShoppingBag className="w-4 h-4" />;
    label = 'Amazon';
  } else if (norm.includes('zomato')) {
    bg = 'bg-rose-950/60 text-rose-400 border-rose-800/50';
    icon = <Pizza className="w-4 h-4" />;
    label = 'Zomato';
  } else if (norm.includes('flipkart')) {
    bg = 'bg-blue-950/60 text-blue-400 border-blue-800/50';
    icon = <Package className="w-4 h-4" />;
    label = 'Flipkart';
  } else if (norm.includes('uber')) {
    bg = 'bg-neutral-900 text-neutral-200 border-neutral-700';
    icon = <Car className="w-4 h-4" />;
    label = 'Uber';
  } else if (norm.includes('myntra')) {
    bg = 'bg-pink-950/60 text-pink-400 border-pink-800/50';
    icon = <Shirt className="w-4 h-4" />;
    label = 'Myntra';
  } else if (norm.includes('meesho')) {
    bg = 'bg-fuchsia-950/60 text-fuchsia-400 border-fuchsia-800/50';
    icon = <Tag className="w-4 h-4" />;
    label = 'Meesho';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-sm gap-2',
    lg: 'px-3 py-1.5 text-base gap-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm ${bg} ${sizeClasses[size]}`}
    >
      {icon}
      {showName && <span>{label}</span>}
    </span>
  );
};
