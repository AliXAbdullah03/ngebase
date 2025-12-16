"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Clock, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Package,
  Globe,
  Headphones,
  FileText,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function BusinessShipmentPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Exclusive discounted rates for businesses with volume shipping. Save up to 30% compared to standard rates.",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      title: "Volume Discounts",
      description: "The more you ship, the more you save. Tiered pricing structure that rewards your business growth.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Dedicated Account Manager",
      description: "Personal account manager to handle your shipments, provide support, and ensure smooth operations.",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Clock,
      title: "Priority Processing",
      description: "Faster processing times and priority handling for all your business shipments.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics dashboard to track your shipping costs and performance.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      icon: FileText,
      title: "Custom Invoicing",
      description: "Flexible billing options with consolidated invoicing, payment terms, and detailed reporting.",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to our worldwide network with seamless international shipping capabilities.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support dedicated to your business needs and requirements.",
      color: "text-teal-500",
      bgColor: "bg-teal-50",
    },
  ];

  const features = [
    "Bulk shipment processing",
    "API integration for automated shipping",
    "Custom shipping labels and branding",
    "Real-time tracking and notifications",
    "Dedicated pickup services",
    "Flexible payment terms",
    "Monthly consolidated billing",
    "Custom reporting and analytics",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-6 rounded-full bg-primary/10 animate-pulse">
                  <Building2 className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
                Business Shipment Solutions
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Streamline your logistics operations with our comprehensive business shipping solutions. 
                Designed for companies that ship regularly and need reliable, cost-effective solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  <Link href="/admin">
                    Get Started
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  <Link href="#contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose Our Business Solutions?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We understand the unique needs of businesses. That's why we offer specialized services 
                and benefits tailored for commercial shipping.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <CardContent className="p-4 sm:p-6">
                      <div className={`p-3 sm:p-4 rounded-lg ${benefit.bgColor} mb-3 sm:mb-4 inline-block`}>
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${benefit.color}`} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Comprehensive Business Features
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Our business shipping platform comes with enterprise-grade features designed 
                    to simplify your logistics operations and reduce costs.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Card className="border-2 border-primary/20 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Zap className="w-6 h-6 text-primary" />
                        Business Account Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Volume Discounts</h3>
                            <p className="text-muted-foreground text-sm">
                              Save up to 30% on shipping costs with our volume-based pricing tiers.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <BarChart3 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Analytics Dashboard</h3>
                            <p className="text-muted-foreground text-sm">
                              Track shipments, costs, and performance metrics in real-time.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <Shield className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Priority Support</h3>
                            <p className="text-muted-foreground text-sm">
                              Dedicated account manager and 24/7 priority customer support.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Flexible Billing</h3>
                            <p className="text-muted-foreground text-sm">
                              Custom payment terms, consolidated invoicing, and detailed reports.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Flexible Pricing Plans
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your shipping volume and business needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-primary/10">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Starter</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">For small businesses</p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl font-bold">10%</span>
                    <p className="text-sm sm:text-base text-muted-foreground">Volume Discount</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Up to 100 shipments/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Email support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Basic reporting</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary shadow-xl md:scale-105">
                <CardHeader className="text-center pb-3 sm:pb-4 bg-primary/5">
                  <div className="inline-block px-2 sm:px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-2">
                    MOST POPULAR
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Professional</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">For growing businesses</p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl font-bold">20%</span>
                    <p className="text-sm sm:text-base text-muted-foreground">Volume Discount</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Up to 500 shipments/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">API access</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader className="text-center pb-4">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-muted-foreground">For large businesses</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold">30%</span>
                    <p className="text-muted-foreground">Volume Discount</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Unlimited shipments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Dedicated account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Custom solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">24/7 priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of businesses that trust us for their shipping needs. 
                Get in touch with our sales team to discuss your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link href="/admin">
                    Create Business Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                  <Link href="mailto:sales@nge.com">
                    Contact Sales Team
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EnhancedFooter />
    </div>
  );
}


