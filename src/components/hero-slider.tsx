"use client"

import { TrackingSearch } from '@/components/tracking-search';
import { Search, CheckCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const heroImages = [
  {
    id: 1,
    title: "Global Reach, Personal Touch.",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=800&fit=crop",
  },
  {
    id: 2,
    title: "Fast. Reliable. Secure.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop",
  },
  {
    id: 3,
    title: "Worldwide Network.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
  }
];

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play functionality for images
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to start
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
        <div className="space-y-6 animate-slide-in-left">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">Fast. Reliable. Secure.</span>
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Your Trusted Logistics Partner
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
              Connecting businesses worldwide with seamless shipping solutions and real-time tracking.
            </p>
          </div>

          {/* Tracking Search */}
          <div className="mt-10 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Track Your Shipment</h3>
              <p className="text-sm text-muted-foreground">Enter your tracking number to get real-time updates</p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-0 border-2 border-primary/30 rounded-xl bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 max-w-2xl overflow-hidden">
                <div className="flex items-center px-4 py-3 bg-primary/5 border-r border-primary/10">
                  <Search className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <div className="flex-grow">
                  <TrackingSearch />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>Example:</span>
              <code className="px-2 py-0.5 bg-primary/10 rounded text-primary font-mono text-xs">NGE123456789</code>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              "No Minimum Weight",
              "2-3 Days Delivery",
              "Real-Time Updates",
              "100% Insured"
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 text-foreground animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Image Slider */}
        <div className="hidden lg:block relative w-full h-[600px] animate-slide-in-right">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl -z-10"></div>
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full h-[600px] relative"
          >
            <CarouselContent className="h-[600px] -ml-0">
              {heroImages.map((item, index) => (
                <CarouselItem key={item.id} className="pl-0 basis-full h-[600px]">
                  <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-transparent border-transparent">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-xl"
                      priority={index === 0}
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Image Slider Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === index 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/70 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
