import { Camera, Sparkles, Repeat2, Truck } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    step: '1',
    title: 'Snap a photo',
    description: 'Just take a quick picture of the item you want to part with. Don\'t worry about perfect lighting.',
    color: 'bg-sage-50 text-forest-600',
  },
  {
    icon: Sparkles,
    step: '2',
    title: 'Get it listed',
    description: 'Add a few details like size and condition. We\'ll help suggest a price based on similar items.',
    color: 'bg-sand-50 text-sand-700',
  },
  {
    icon: Repeat2,
    step: '3',
    title: 'Chat & negotiate',
    description: 'Connect with people looking for exactly what you have. Accept cash or agree to a swap.',
    color: 'bg-gray-50 text-gray-700',
  },
  {
    icon: Truck,
    step: '4',
    title: 'Ship it off',
    description: 'We handle the pickup and delivery. You just pack it up and wave goodbye.',
    color: 'bg-forest-50 text-forest-700',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-sage-100">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-forest-900 mb-4">How it works</h2>
        <p className="text-forest-700 max-w-xl mx-auto text-lg">
          We've made it as simple as possible to pass along clothes you no longer wear.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map(({ icon: Icon, step, title, description, color }) => (
          <div key={step} className="relative flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-6 shadow-sm border border-gray-100`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="text-sm font-semibold text-gray-400 mb-2">Step {step}</div>
            <h3 className="font-semibold text-forest-900 mb-3 text-lg">{title}</h3>
            <p className="text-sm text-forest-700 leading-relaxed max-w-[250px]">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
