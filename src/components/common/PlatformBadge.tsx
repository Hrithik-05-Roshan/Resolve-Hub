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

  let bg = 'bg-slate-900 text-slate-200 border-slate-700';
  let icon = <ShoppingBag className="w-3.5 h-3.5 text-slate-300" />;
  let label = platform;

  if (norm.includes('shopify')) {
    bg = 'bg-emerald-950/90 text-emerald-300 border-emerald-600/60 shadow-sm shadow-emerald-950/50';
    icon = <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />;
    label = 'Shopify';
  } else if (norm.includes('swiggy')) {
    bg = 'bg-orange-950/90 text-orange-300 border-orange-600/60 shadow-sm shadow-orange-950/50';
    icon = <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />;
    label = 'Swiggy';
  } else if (norm.includes('amazon')) {
    bg = 'bg-amber-950/90 text-amber-300 border-amber-600/60 shadow-sm shadow-amber-950/50';
    icon = <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />;
    label = 'Amazon';
  } else if (norm.includes('zomato')) {
    bg = 'bg-rose-950/90 text-rose-300 border-rose-600/60 shadow-sm shadow-rose-950/50';
    icon = <Pizza className="w-3.5 h-3.5 text-rose-400" />;
    label = 'Zomato';
  } else if (norm.includes('flipkart')) {
    bg = 'bg-blue-950/90 text-blue-300 border-blue-600/60 shadow-sm shadow-blue-950/50';
    icon = <Package className="w-3.5 h-3.5 text-blue-400" />;
    label = 'Flipkart';
  } else if (norm.includes('uber')) {
    bg = 'bg-neutral-900 text-neutral-200 border-neutral-700 shadow-sm shadow-neutral-950/50';
    icon = <Car className="w-3.5 h-3.5 text-neutral-300" />;
    label = 'Uber';
  } else if (norm.includes('myntra')) {
    bg = 'bg-pink-950/90 text-pink-300 border-pink-600/60 shadow-sm shadow-pink-950/50';
    icon = <Shirt className="w-3.5 h-3.5 text-pink-400" />;
    label = 'Myntra';
  } else if (norm.includes('meesho')) {
    bg = 'bg-fuchsia-950/90 text-fuchsia-300 border-fuchsia-600/60 shadow-sm shadow-fuchsia-950/50';
    icon = <Tag className="w-3.5 h-3.5 text-fuchsia-400" />;
    label = 'Meesho';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-sm gap-2',
    lg: 'px-3 py-1.5 text-base gap-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${bg} ${sizeClasses[size]}`}
    >
      {icon}
      {showName && <span>{label}</span>}
    </span>
  );
};
