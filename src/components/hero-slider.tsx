"use client"

import { TrackingSearch } from '@/components/tracking-search';
import { Search } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Load hero images from localStorage or use default
const getHeroImages = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('heroImages');
    if (saved) {
      try {
        const images = JSON.parse(saved);
        if (Array.isArray(images) && images.length > 0) {
          return images.map((img: any) => ({
            id: img.id,
            title: img.title || 'Hero Image',
            image: img.path || img.url || '/hero-images/hero-1.jpg',
          }));
        }
      } catch (e) {
        console.error('Error parsing hero images from localStorage:', e);
      }
    }
  }
  // Default fallback images - use existing images or placeholder
  return [
    {
      id: 1,
      title: "Global Reach, Personal Touch.",
      image: "/hero-images/image1.jpg",
    },
    {
      id: 2,
      title: "Fast. Reliable. Secure.",
      image: "/hero-images/image2.jpg",
    },
    {
      id: 3,
      title: "Worldwide Network.",
      image: "/hero-images/logistics-in-india-scaled.webp",
    }
  ];
};

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [heroImages, setHeroImages] = useState(getHeroImages());

  // Listen for changes to hero images in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setHeroImages(getHeroImages());
    };

    // Listen for storage events (when localStorage changes in another tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes (for same-tab updates)
    const interval = setInterval(() => {
      const newImages = getHeroImages();
      if (JSON.stringify(newImages) !== JSON.stringify(heroImages)) {
        setHeroImages(newImages);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [heroImages]);

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
    <section className="relative min-h-[90vh] flex items-start overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50/30 to-pink-50/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-12 md:pb-20">
        <div className="space-y-4 md:space-y-6 animate-slide-in-left">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] sm:leading-[1.15] md:leading-[1.2]">
              <span className="block">Fast. Reliable. Secure.</span>
              <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-1 sm:pb-2">
                Your Trusted Logistics Partner
              </span>
            </h1>
          </div>

          {/* Tracking Search */}
          <div className="mt-6 md:mt-10 space-y-2 md:space-y-3">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">Track Your Shipment</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Enter your tracking number to get real-time updates</p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-0 border-2 border-violet-300/30 rounded-xl bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-violet-500/50 transition-all duration-300 max-w-2xl overflow-hidden">
                <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-b sm:border-b-0 sm:border-r border-violet-200/30">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 flex-shrink-0" />
                </div>
                <div className="flex-grow min-w-0">
                  <TrackingSearch />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
              <span>Example:</span>
              <code className="px-2 py-0.5 bg-gradient-to-r from-violet-100 to-purple-100 rounded text-violet-600 font-mono text-xs break-all">NGE123456789</code>
            </p>
          </div>
        </div>

        {/* Right Side - Image Slider */}
        <div className="hidden lg:block relative w-full h-[500px] xl:h-[600px] animate-slide-in-right">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/10 rounded-3xl blur-3xl -z-10"></div>
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full h-[500px] xl:h-[600px] relative"
          >
            <CarouselContent className="h-[500px] xl:h-[600px] -ml-0">
              {heroImages.map((item, index) => (
                <CarouselItem key={item.id} className="pl-0 basis-full h-[500px] xl:h-[600px]">
                  <div className="relative w-full h-[500px] xl:h-[600px] rounded-2xl overflow-hidden bg-transparent border-transparent">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-xl"
                      priority={index === 0}
                      sizes="50vw"
                      unoptimized={item.image.endsWith('.webp')}
                      onError={(e) => {
                        console.error('Failed to load image:', item.image);
                        // Fallback to a placeholder or hide the image
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
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
        <div className="w-6 h-10 border-2 border-violet-500/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-violet rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
