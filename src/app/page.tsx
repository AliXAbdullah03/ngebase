"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { HeroSlider } from '@/components/hero-slider';
import { EnhancedServices } from '@/components/enhanced-services';
import { StatsSection } from '@/components/stats-section';
import { TestimonialsSlider } from '@/components/testimonials-slider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PackagePlus, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Globe,
  Zap,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />

      <main className="flex-grow pt-20">
        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Quick Actions Section */}
        <section className="py-16 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              <Link href="/business-shipment" className="group w-full max-w-sm">
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <PackagePlus className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors mb-2">
                      Business Shipment
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                      Best rates for businesses
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/faqs" className="group w-full max-w-sm">
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-white">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <HelpCircle className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors mb-2">
                      FAQs
                    </h3>
                    <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                      Get answers to common questions
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <EnhancedServices />

        {/* Statistics Section */}
        <StatsSection />

        {/* Global Hubs Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <Globe className="w-8 h-8 text-primary" />
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Our Global Hubs
                </h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Strategically located hubs for seamless shipping to and from the UAE
              </p>
            </div>

            <Tabs defaultValue="dubai" className="w-full max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 mb-8 h-auto">
                <TabsTrigger 
                  value="dubai" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-white/80 py-4 text-lg font-semibold transition-all"
                >
                  Dubai, UAE
                </TabsTrigger>
                <TabsTrigger 
                  value="manila" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-white/80 py-4 text-lg font-semibold transition-all"
                >
                  Manila, Philippines
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dubai" className="animate-fade-in">
                <Card className="bg-white/90 backdrop-blur-sm border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-3xl font-bold mb-2 text-primary">DUBAI HUB</h3>
                          <p className="text-muted-foreground">Our flagship hub in the heart of the Middle East</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-semibold mb-1">Address</p>
                              <p className="text-muted-foreground">Warehouse 42, Al Quoz Industrial Area 3, Dubai, UAE</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-semibold mb-1">Email</p>
                              <a href="mailto:customercare@nge.ae" className="text-muted-foreground hover:text-primary transition-colors">
                                customercare@nge.ae
                              </a>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-semibold mb-1">Mobile</p>
                              <a href="tel:+971501234567" className="text-muted-foreground hover:text-primary transition-colors">
                                +971 50 123 4567
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-primary/10 border-primary/20">
                            <CardContent className="p-4 text-center">
                              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                              <p className="font-semibold text-primary">Operating Time</p>
                              <p className="text-sm mt-1">EVERYDAY</p>
                              <p className="text-sm font-medium">9 AM - 6 PM</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-primary/10 border-primary/20">
                            <CardContent className="p-4 text-center">
                              <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                              <p className="font-semibold text-primary">Time Zone</p>
                              <p className="text-sm mt-1">UAE Time Zone</p>
                              <p className="text-sm font-medium">GMT+4</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-lg border-2 border-primary/20">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.026933303158!2d55.385!3d25.269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5c5b5f5f5f5f%3A0x3f3f3f3f3f3f3f3f!2sDubai!5e0!3m2!1sen!2sae!4v1622712345678" 
                          width="100%" 
                          height="100%" 
                          style={{border:0, minHeight: '400px'}} 
                          allowFullScreen={true} 
                          loading="lazy"
                          className="w-full"
                        ></iframe>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manila" className="animate-fade-in">
                <Card className="bg-white/90 backdrop-blur-sm border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-3xl font-bold mb-2 text-primary">MANILA HUB</h3>
                          <p className="text-muted-foreground">Our strategic hub in Southeast Asia</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-semibold mb-1">Address</p>
                              <p className="text-muted-foreground">Unit 14, Cargo Complex, 123 Airline Avenue, Pasay City, Metro Manila, Philippines</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-semibold mb-1">Email</p>
                              <a href="mailto:customercare.ph@nge.com" className="text-muted-foreground hover:text-primary transition-colors">
                                customercare.ph@nge.com
                              </a>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                            <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-semibold mb-1">Mobile</p>
                              <a href="tel:+639171234567" className="text-muted-foreground hover:text-primary transition-colors">
                                +63 917 123 4567
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-primary/10 border-primary/20">
                            <CardContent className="p-4 text-center">
                              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                              <p className="font-semibold text-primary">Operating Time</p>
                              <p className="text-sm mt-1">WEEKDAYS</p>
                              <p className="text-sm font-medium">8 AM - 5 PM</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-primary/10 border-primary/20">
                            <CardContent className="p-4 text-center">
                              <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                              <p className="font-semibold text-primary">Time Zone</p>
                              <p className="text-sm mt-1">PH Time Zone</p>
                              <p className="text-sm font-medium">GMT+8</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-lg border-2 border-primary/20">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123560.6815344331!2d120.94523319985207!3d14.57321949195992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9a63a56213d%3A0x446d35434d742618!2sManila%2C%20Metro%20Manila%2C%20Philippines!5e0!3m2!1sen!2sae!4v1717590855781!5m2!1sen!2sae"
                          width="100%" 
                          height="100%" 
                          style={{border:0, minHeight: '400px'}} 
                          allowFullScreen={true} 
                          loading="lazy"
                          className="w-full"
                        ></iframe>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSlider />

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Us</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience the difference of working with a logistics partner that truly cares
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Express delivery options for urgent shipments. We understand time is money.",
                  color: "text-yellow-500"
                },
                {
                  icon: ShieldCheck,
                  title: "100% Secure",
                  description: "Your shipments are fully insured and tracked every step of the way.",
                  color: "text-green-500"
                },
                {
                  icon: Globe,
                  title: "Global Network",
                  description: "150+ countries served with local expertise in every market.",
                  color: "text-primary"
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center"
                    style={{ animation: `fadeIn 0.8s ease-out ${index * 0.15}s both` }}
                  >
                    <CardContent className="p-8">
                      <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-full bg-primary/10 ${feature.color}`}>
                          <Icon className="w-10 h-10" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <EnhancedFooter />
    </div>
  );
}
