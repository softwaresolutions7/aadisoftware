import React from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Layers, 
  Warehouse, 
  Calculator, 
  Pill, 
  Cpu, 
  Package, 
  Server,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  ShoppingBag,
  Layers,
  Warehouse,
  Calculator,
  Pill,
  Cpu,
  Package,
  Server,
};

export const getSoftwareIcon = (name: string): LucideIcon => {
  return iconMap[name] || Cpu;
};
