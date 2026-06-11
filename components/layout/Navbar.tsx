'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, ShoppingBag, Menu, X, Leaf, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Bhav-Tav', href: '/swap' },
  { label: 'How It Works', href: '/how-it-works' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const pathname = usePathname();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-sage-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center group-hover:bg-forest-700 transition-colors">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-forest-900 tracking-tight">
              Karma<span className="text-forest-500">Closet</span>
            </span>
          </Link>

          {/* City Selector - Desktop */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-sage-100"
            >
              <MapPin className="w-3.5 h-3.5 text-forest-500" />
              {selectedCity}
              <ChevronDown className={cn('w-3.5 h-3.5 text-forest-400 transition-transform', cityOpen && 'rotate-180')} />
            </button>
            {cityOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-card border border-sage-100 py-1 z-50">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => { setSelectedCity(city); setCityOpen(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-sage-50',
                      city === selectedCity ? 'text-forest-700 font-medium' : 'text-forest-600'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-sage-100 text-forest-800'
                    : 'text-forest-700 hover:bg-sage-50 hover:text-forest-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 rounded-lg text-forest-600 hover:bg-sage-100 hover:text-forest-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg text-forest-600 hover:bg-sage-100 hover:text-forest-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <Link href="/cart">
              <button className="p-2 rounded-lg text-forest-600 hover:bg-sage-100 hover:text-forest-800 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-forest-600 text-white border-0">
                  2
                </Badge>
              </button>
            </Link>
            <Link href="/sell">
              <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium shadow-eco ml-1">
                + Sell from Closet
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" variant="outline" className="rounded-lg border-sage-300 text-forest-700 hover:bg-sage-50 font-medium">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button className="p-2 rounded-lg text-forest-600 hover:bg-sage-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-forest-600 hover:bg-sage-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-sage-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {/* City selector mobile */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sage-50 mb-3">
              <MapPin className="w-4 h-4 text-forest-500" />
              <span className="text-sm font-medium text-forest-700">Delivering to {selectedCity}</span>
              <button className="ml-auto text-xs text-forest-500 underline">Change</button>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-sage-100 text-forest-800'
                    : 'text-forest-700 hover:bg-sage-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-sage-300 text-forest-700 rounded-lg">
                  Login
                </Button>
              </Link>
              <Link href="/sell" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white rounded-lg">
                  + Sell from Closet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
