'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Search, Bell, ShoppingBag, Menu, X, Leaf, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Bhav-Tav', href: '/swap' },
  { label: 'How It Works', href: '/how-it-works' },
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        scrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-sm border-border/80 py-2'
          : 'bg-transparent border-transparent py-4'
      )}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm"
            >
              <Leaf className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.2} />
            </motion.div>
            <span className="font-bold text-lg text-foreground tracking-tight select-none">
              Karma<span className="text-gradient-gold font-serif-editorial italic font-normal ml-0.5">Closet</span>
            </span>
          </Link>

          {/* City Selector - Desktop */}
          <div className="hidden md:flex items-center relative ml-6">
            <motion.button
              onClick={() => setCityOpen(!cityOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/60"
            >
              <MapPin className="w-3.5 h-3.5 text-accent" />
              {selectedCity}
              <ChevronDown className={cn('w-3 h-3 text-foreground/45 transition-transform duration-300', cityOpen && 'rotate-180')} />
            </motion.button>
            
            <AnimatePresence>
              {cityOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, rotateX: -12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, rotateX: -12, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{ originY: 0, perspective: 800 }}
                  className="absolute top-full left-0 mt-2 w-44 bg-card rounded-xl shadow-xl border border-border/80 py-1.5 z-50"
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCityOpen(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-secondary',
                        city === selectedCity ? 'text-accent' : 'text-foreground/70'
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav Links - Desktop with sliding hover pill */}
          <nav 
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider relative transition-colors duration-300 z-10',
                    isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
                  )}
                >
                  {link.label}
                  
                  {/* Sliding Hover background */}
                  {hoveredLink === link.href && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 bg-secondary/80 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}

                  {/* Active dot */}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveDot"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Search */}
            <motion.button 
              whileHover={{ y: -2, scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg text-foreground/60 hover:bg-secondary/80 hover:text-foreground transition-all"
            >
              <Search className="w-4.5 h-4.5" />
            </motion.button>
            
            {/* Notifications */}
            <motion.button 
              whileHover={{ y: -2, scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg text-foreground/60 hover:bg-secondary/80 hover:text-foreground transition-all relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent ring-2 ring-background animate-pulse" />
            </motion.button>
            
            {/* Shopping Bag */}
            <Link href="/cart">
              <motion.button 
                whileHover={{ y: -2, scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg text-foreground/60 hover:bg-secondary/80 hover:text-foreground transition-all relative"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <Badge className="absolute top-1.5 right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[8px] bg-primary text-primary-foreground border-0 font-bold">
                  2
                </Badge>
              </motion.button>
            </Link>
            
            {/* CTAs */}
            <Link href="/sell">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 py-2 ml-1 shadow-sm glow-card border border-border/10">
                  + Sell Closet
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button size="sm" variant="outline" className="rounded-lg border-border text-foreground/80 hover:bg-secondary text-[10px] font-bold uppercase tracking-wider px-4 py-2">
                  Login
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button className="p-2.5 rounded-lg text-foreground/60 hover:bg-secondary/80 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-lg text-foreground/60 hover:bg-secondary/80 transition-colors"
            >
              {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-secondary/80 mb-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Delivering to {selectedCity}</span>
                <button className="ml-auto text-[10px] text-accent font-bold uppercase tracking-wider underline">Change</button>
              </div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors',
                    pathname === link.href
                      ? 'bg-secondary text-foreground'
                      : 'text-foreground/70 hover:bg-secondary/60'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-3 flex gap-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-border text-foreground/80 rounded-lg hover:bg-secondary text-[10px] font-bold uppercase tracking-wider py-3.5">
                    Login
                  </Button>
                </Link>
                <Link href="/sell" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg text-[10px] font-bold uppercase tracking-wider py-3.5">
                    + Sell Closet
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
