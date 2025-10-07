// components/navbar/NavItemRenderer.tsx
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

export function renderMainNavItem({
  title,
  path,
  isActive,
  hasDropdown,
  isDropdownOpen,
  onClick,
  children
}: {
  title: string;
  path: string;
  isActive: boolean;
  hasDropdown: boolean;
  isDropdownOpen: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="relative">
      <Link
        href={path}
        onClick={onClick}
        className={`flex items-center space-x-1 text-white/90 font-medium tracking-tight hover:text-purple-400 transition-all duration-300 border-b-2 ${isActive ? 'border-purple-500/40' : 'border-transparent hover:border-purple-500/30'} pb-1 text-sm`}
      >
        <span>{title}</span>
        {hasDropdown && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        )}
      </Link>
      {isDropdownOpen && children}
    </div>
  );
}

export function renderDropdownItem({
  icon,
  title,
  description,
  gradient,
  onClick
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-black/90 transition-all duration-300 hover:border-purple-500/30 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 overflow-x-hidden"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold text-sm mb-0.5 tracking-tight">{title}</h4>
          {description && <p className="text-white/70 text-xs mb-1 line-clamp-2">{description}</p>}
        </div>
        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
      </div>
    </div>
  );
}