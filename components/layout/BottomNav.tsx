'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chrome as Home, Search, CirclePlus as PlusCircle, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Sell', href: '/sell', icon: PlusCircle, highlight: true },
  { label: 'Chat', href: '/chat', icon: MessageCircle },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-sage-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-1 safe-area-pb">
        {navItems.map(({ label, href, icon: Icon, highlight }) => {
          const isActive = pathname === href;

          if (highlight) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 -mt-5 px-2"
              >
                <div className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(196,164,124,0.3)] transition-all duration-200',
                  'bg-primary hover:bg-primary/90 active:scale-95'
                )}>
                  <Icon className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold text-accent mt-0.5">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 min-w-[52px]',
                isActive ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'
              )}
            >
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                isActive ? 'bg-secondary' : 'hover:bg-secondary/40'
              )}>
                <Icon
                  className={cn('w-5 h-5 transition-all', isActive && 'scale-110')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                'text-[10px] font-semibold transition-colors',
                isActive ? 'text-foreground' : 'text-foreground/50'
              )}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
