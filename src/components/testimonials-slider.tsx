"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, Tech Solutions Inc.",
    content: "Next Global Express has transformed our supply chain. Their reliability and real-time tracking give us complete peace of mind. Outstanding service!",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Operations Manager, Global Trade Co.",
    content: "The fastest and most efficient logistics partner we've worked with. Their air freight service saved us critical time on multiple occasions.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Founder, E-Commerce Plus",
    content: "From small parcels to bulk shipments, they handle everything with professionalism. The customer service team is always responsive and helpful.",
    rating: 5,
    avatar: "ER"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Director, Manufacturing Corp",
    content: "Their ocean freight rates are competitive, and the service is exceptional. We've been shipping with them for 3 years without a single issue.",
    rating: 5,
    avatar: "DT"
  }
];

export function TestimonialsSlider() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by thousands of businesses worldwide for reliable logistics solutions
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                <div className="h-full">
                  <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                          />
                        ))}
                      </div>
                      
                      <Quote className="w-8 h-8 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />
                      
                      <p className="text-muted-foreground mb-6 flex-grow italic">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Avatar className="bg-primary/10">
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
}


