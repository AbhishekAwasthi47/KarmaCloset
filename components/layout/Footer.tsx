import Link from 'next/link';
import { Leaf, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Bhav-Tav Swaps', href: '/swap' },
    { label: 'Sell from Closet', href: '/sell' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Buyer Protection', href: '/buyer-protection' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Report an Issue', href: '/report' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Karma Stories', href: '/sustainability' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Grievance Officer', href: '/grievance' },
  ],
};

const ecoStats = [
  { value: '12,400+', label: 'Closets Refreshed' },
  { value: '8.2 Tonnes', label: 'Karma Earned' },
  { value: '3,800+', label: 'Karma Members' },
  { value: '42 Cities', label: 'Across India' },
];

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100 mt-auto hidden md:block">
      {/* Impact Banner */}
      <div className="bg-forest-900 border-b border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-400/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-sage-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-cream-200">Every Closet Deserves Good Karma</p>
                <p className="text-xs text-sage-300 mt-0.5">Every swap earns karma. Every item finds a new home.</p>
              </div>
            </div>
            <div className="flex items-center gap-8 md:gap-12">
              {ecoStats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-bold text-sage-300">{value}</p>
                  <p className="text-xs text-forest-300 mt-0.5 whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Karma<span className="text-sage-400">Closet</span>
              </span>
            </Link>
            <p className="text-sm text-forest-300 leading-relaxed mb-5 max-w-xs">
              India's first AI-powered sustainable closet. Buy, sell, or swap pre-owned and eco-friendly items — because good karma starts with your wardrobe.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-3.5 h-3.5 text-forest-400" />
              <span className="text-xs text-forest-300">hello@karmacloset.in</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-3.5 h-3.5 text-forest-400" />
              <span className="text-xs text-forest-300">1800-XXX-XXXX (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-3.5 h-3.5 text-forest-400" />
              <span className="text-xs text-forest-300">Bengaluru, India</span>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-forest-300 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-cream-200 mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-forest-300 hover:text-sage-300 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-forest-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forest-400">
            © 2024 KarmaCloset Technologies Pvt. Ltd. All rights reserved. | CIN: UXXXXXXKARNXXXXPTCXXXXXX
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-forest-400">Payments secured by</span>
              <span className="text-xs font-semibold text-sage-400">Razorpay</span>
            </div>
            <span className="text-forest-600">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-forest-400">Shipping by</span>
              <span className="text-xs font-semibold text-sage-400">Delhivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
