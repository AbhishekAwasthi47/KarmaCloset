import HowItWorks from '@/components/home/HowItWorks';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-eco-gradient">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-forest-900">How KarmaCloset Works</h1>
          <p className="text-forest-600 mt-2 text-lg">From closet to doorstep — sustainable fashion in 4 easy steps.</p>
        </div>
      </div>
      <HowItWorks />
    </div>
  );
}
