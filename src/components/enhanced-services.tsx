"use client"

import Link from 'next/link';
import { Plane, ArrowRight, Zap, Shield, Clock, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    id: 1,
    title: 'Air Freight',
    description: 'Fast and reliable air cargo services for time-sensitive shipments. Get your packages delivered across the globe in record time.',
    icon: Plane,
    href: '/services/air-freight',
    features: ['Express Delivery', 'Global Coverage', 'Real-time Tracking'],
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500'
  }
];

const features = [
  { icon: Zap, text: 'Lightning Fast', color: 'text-yellow-500' },
  { icon: Shield, text: '100% Secure', color: 'text-green-500' },
  { icon: Clock, text: 'On-Time Delivery', color: 'text-blue-500' },
  { icon: Globe, text: 'Worldwide Network', color: 'text-violet-600' }
];

export function EnhancedServices() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Available Service</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive logistics solutions tailored to your business needs
          </p>
        </div>

        {/* Features Bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 hover:from-violet-200 hover:to-purple-200 transition-colors cursor-default"
                style={{ animation: `fadeIn 0.6s ease-out ${index * 0.1}s both` }}
              >
                <Icon className={`w-5 h-5 ${feature.color}`} />
                <span className="font-medium text-sm">{feature.text}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link 
                key={service.id} 
                href={service.href}
                className="group"
                style={{ animation: `fadeIn 0.8s ease-out ${index * 0.15}s both` }}
              >
                <Card className="h-full border-2 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative bg-white">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200 transition-all duration-300 group-hover:scale-110">
                        <Icon className={`w-10 h-10 ${service.iconColor} group-hover:rotate-12 transition-transform duration-300`} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-violet group-hover:scale-150 transition-transform"></div>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold group-hover:gap-4 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 text-violet-600 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


