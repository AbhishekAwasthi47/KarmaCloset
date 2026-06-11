import { Leaf, Recycle, Users, Zap } from 'lucide-react';

const stats = [
  {
    icon: Recycle,
    value: '12,400+',
    label: 'Closets Refreshed',
    sub: 'items swapped & counting',
  },
  {
    icon: Leaf,
    value: '8.2 Tonnes',
    label: 'Karma Earned',
    sub: 'CO₂ saved — 412 trees worth',
  },
  {
    icon: Users,
    value: '3,800+',
    label: 'Karma Members',
    sub: 'across 42 cities',
  },
  {
    icon: Zap,
    value: '< 2 min',
    label: 'AI Magic Listing',
    sub: 'from photo to live',
  },
];

export default function StatsBar() {
  return (
    <section className="py-12 bg-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-forest-800 group-hover:bg-forest-700 flex items-center justify-center mx-auto mb-3 transition-colors">
                <Icon className="w-6 h-6 text-sage-300" />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-white mb-0.5">{value}</p>
              <p className="text-sm font-semibold text-sage-300">{label}</p>
              <p className="text-xs text-forest-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
