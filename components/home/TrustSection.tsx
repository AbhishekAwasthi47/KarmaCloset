import { Shield, CreditCard, Truck, BadgeCheck } from 'lucide-react';

const trustFeatures = [
  {
    icon: BadgeCheck,
    title: 'Verified community',
    description: 'We do basic checks on sellers so you know you\'re dealing with real people.',
  },
  {
    icon: Shield,
    title: 'Payment protection',
    description: 'We hold the money until you get the item and confirm it matches the description.',
  },
  {
    icon: CreditCard,
    title: 'Easy payments',
    description: 'Use UPI or any other standard payment method you\'re used to.',
  },
  {
    icon: Truck,
    title: 'Door-to-door delivery',
    description: 'Our delivery partners pick up from the seller and drop it off at your place.',
  },
];

const testimonials = [
  {
    name: 'Ananya S.',
    city: 'Delhi',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    review: 'Honestly didn\'t expect it to be this easy. Got rid of three jackets that were just taking up space, and the person who bought them was super nice.',
  },
  {
    name: 'Vikram N.',
    city: 'Bangalore',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    review: 'Found some barely worn sneakers for half the price. The chat feature is chill, no pressure.',
  },
  {
    name: 'Priya M.',
    city: 'Chennai',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    review: 'I love that I can actually see my clothes going to someone who wants them. Makes clearing out the closet feel good.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Trust Features */}
          <div>
            <h2 className="text-3xl font-bold text-forest-900 mb-8">A safe space to swap and shop</h2>
            <div className="space-y-8">
              {trustFeatures.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-sage-50 flex items-center justify-center text-forest-600 border border-sage-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900 mb-1">{title}</h3>
                    <p className="text-sm text-forest-700 leading-relaxed max-w-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <h2 className="text-3xl font-bold text-forest-900 mb-8">What people are saying</h2>
            <div className="space-y-6">
              {testimonials.map(({ name, city, avatar, review }) => (
                <div key={name} className="bg-sage-50/50 rounded-xl p-6 border border-sage-100">
                  <p className="text-forest-800 leading-relaxed mb-4">"{review}"</p>
                  <div className="flex items-center gap-3">
                    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-forest-900">{name}</p>
                      <p className="text-xs text-forest-600">{city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
