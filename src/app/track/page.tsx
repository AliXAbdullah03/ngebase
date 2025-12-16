"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { Search, Package, MapPin, Clock, ShieldCheck, ArrowRight, TrendingUp, Phone, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast({
        title: "Tracking ID Required",
        description: "Please enter a tracking number or order ID",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    
    try {
      // Try to verify the tracking ID exists before redirecting
      const response = await apiRequest(`/orders/track/${encodeURIComponent(trackingId.trim())}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Redirect to tracking details page
          router.push(`/track/${trackingId.trim()}`);
        } else {
          toast({
            title: "Not Found",
            description: result.error?.message || "Tracking ID not found. Please check and try again.",
            variant: "destructive",
          });
        }
      } else if (response.status === 404) {
        toast({
          title: "Not Found",
          description: "Tracking ID not found. Please check and try again.",
          variant: "destructive",
        });
      } else {
        // If backend is not available or returns error, still redirect (frontend will handle error)
        router.push(`/track/${trackingId.trim()}`);
      }
    } catch (err: any) {
      console.error('Error searching tracking:', err);
      // Still redirect - the details page will handle the error
      router.push(`/track/${trackingId.trim()}`);
    } finally {
      setSearching(false);
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
        <section className="relative py-20 bg-gradient-to-br from-violet-50 via-purple-50/30 to-pink-50/20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 mb-4">
                  <Package className="w-10 h-10 text-violet-600" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Track Your <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Shipment</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Enter your tracking number or order ID to get real-time updates on your package location and delivery status
                </p>
              </div>

              {/* Enhanced Tracking Search */}
              <div className="mt-6 sm:mt-10 space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                  <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-0 border-2 border-violet-500/30 rounded-xl bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-violet-500/50 transition-all duration-300 max-w-3xl mx-auto overflow-hidden">
                    <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3 bg-violet-400/20 border-b sm:border-b-0 sm:border-r border-violet-500/10">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 flex-shrink-0" />
                    </div>
                    <form onSubmit={handleSearch} className="flex flex-grow items-center min-w-0">
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter tracking number or order ID"
                        className="flex-grow border-0 focus:outline-none focus:ring-0 bg-transparent h-12 sm:h-14 text-sm sm:text-base placeholder:text-muted-foreground/60 px-3 sm:px-4 min-w-0"
                        aria-label="Tracking ID"
                        disabled={searching}
                      />
                      <Button 
                        type="submit" 
                        className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 rounded-r-xl bg-primary hover:bg-primary/90 text-violet-600-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group text-sm sm:text-base"
                        disabled={!trackingId.trim() || searching}
                      >
                        {searching ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="hidden sm:inline">Searching...</span>
                          </>
                        ) : (
                          <>
                            <span>Track</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1 px-4">
                  <span>Examples:</span>
                  <code className="px-2 py-0.5 bg-gradient-to-br from-violet-100 to-purple-100 rounded text-violet-600 font-mono text-xs break-all">NGE123456789</code>
                  <span>or</span>
                  <code className="px-2 py-0.5 bg-gradient-to-br from-violet-100 to-purple-100 rounded text-violet-600 font-mono text-xs break-all">ORD-1001</code>
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
                Why Track With <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Us</span>
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
                    className="border-2 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center group"
                    style={{ animation: `fadeIn 0.8s ease-out ${index * 0.1}s both` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 to-purple-200 transition-colors">
                          <Icon className="w-6 h-6 text-violet-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">
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
            <Card className="max-w-4xl mx-auto border-2 border-violet-500/20 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Need <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Help?</span>
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
                    <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-violet hover:opacity-90">
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
