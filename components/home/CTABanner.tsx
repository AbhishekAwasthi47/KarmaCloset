import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTABanner() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-sage-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#faf8f3] rounded-2xl p-10 md:p-14 text-center border border-sage-200">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
            Have clothes you don't wear?
          </h2>
          <p className="text-forest-700 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Pass them on to someone who will. Listing takes just a couple of minutes, and it's completely free for individuals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sell">
              <Button className="bg-forest-700 hover:bg-forest-800 text-white font-medium px-8 py-3 h-auto rounded-md text-base transition-colors">
                List an item
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="border-forest-300 text-forest-700 hover:bg-white hover:text-forest-900 px-8 py-3 h-auto rounded-md text-base font-medium">
                Browse instead
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
