"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { TrackingSearch } from '@/components/tracking-search';
import { Search, Package, MapPin, Clock, ShieldCheck, ArrowRight, TrendingUp, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId.trim()}`);
    }
  };

  const features = [
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Get instant notifications about your shipment status"
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Track your package location at every step"
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description: "Your shipment is fully insured and protected"
    },
    {
      icon: TrendingUp,
      title: "Fast Delivery",
      description: "Express shipping options available worldwide"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Package className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Track Your <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Shipment</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Enter your tracking number to get real-time updates on your package location and delivery status
                </p>
              </div>

              {/* Enhanced Tracking Search */}
              <div className="mt-10 space-y-3">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-0 border-2 border-primary/30 rounded-xl bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 max-w-3xl mx-auto overflow-hidden">
                    <div className="flex items-center px-4 py-3 bg-primary/5 border-r border-primary/10">
                      <Search className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                    <form onSubmit={handleSearch} className="flex flex-grow items-center">
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter tracking number (e.g., NGE123456789)"
                        className="flex-grow border-0 focus:outline-none focus:ring-0 bg-transparent h-14 text-base placeholder:text-muted-foreground/60 px-4"
                        aria-label="Tracking ID"
                      />
                      <Button 
                        type="submit" 
                        className="h-14 px-8 rounded-r-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
                        disabled={!trackingId.trim()}
                      >
                        <span>Track</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <span>Example:</span>
                  <code className="px-2 py-0.5 bg-primary/10 rounded text-primary font-mono text-xs">NGE123456789</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Track With <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Us</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience seamless tracking with our advanced logistics platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center group"
                    style={{ animation: `fadeIn 0.8s ease-out ${index * 0.1}s both` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Need <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Help?</span>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Can't find your tracking number? Contact our support team for assistance
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                      <Link href="tel:+971501234567" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call Support
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                      <Link href="mailto:customercare@nge.ae" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <EnhancedFooter />
    </div>
  );
}

