"use client"

import { AnimatedCounter } from './animated-counter';
import { Globe, Package, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    id: 1,
    value: 150,
    suffix: '+',
    label: 'Countries Served',
    description: 'Global reach across continents',
    icon: Globe,
    color: 'text-blue-500'
  },
  {
    id: 2,
    value: 500000,
    suffix: '+',
    label: 'Packages Delivered',
    description: 'Successfully shipped worldwide',
    icon: Package,
    color: 'text-primary'
  },
  {
    id: 3,
    value: 10000,
    suffix: '+',
    label: 'Happy Clients',
    description: 'Trusted by businesses globally',
    icon: Users,
    color: 'text-green-500'
  },
  {
    id: 4,
    value: 25,
    suffix: '+',
    label: 'Years of Excellence',
    description: 'Industry-leading experience',
    icon: Award,
    color: 'text-yellow-500'
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Numbers That Speak
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our commitment to excellence reflected in every milestone we achieve
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.id} 
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group overflow-hidden relative bg-white/80 backdrop-blur-sm"
                style={{ 
                  animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors ${stat.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-4xl md:text-5xl font-bold text-foreground">
                      <AnimatedCounter 
                        value={stat.value} 
                        suffix={stat.suffix}
                        className="inline-block"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}


