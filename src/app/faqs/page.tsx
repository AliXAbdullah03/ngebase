"use client"

import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Search,
  MessageCircle,
  Mail,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function FAQsPage() {
  const faqCategories = [
    {
      title: "Shipping & Delivery",
      icon: "📦",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Shipping times vary based on the service type and destination. Standard shipping typically takes 5-7 business days, while express shipping can arrive in 2-3 business days. International shipments may take 7-14 business days depending on the destination country and customs processing."
        },
        {
          question: "What are your shipping rates?",
          answer: "Our shipping rates depend on several factors including package weight, dimensions, destination, and service type. Please contact our sales team for a quote or to discuss business volume pricing."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we offer international shipping to over 200 countries worldwide. We handle all customs documentation and provide real-time tracking for international shipments. Delivery times and rates vary by destination."
        },
        {
          question: "What is the maximum weight and size for packages?",
          answer: "For standard shipping, packages can weigh up to 70kg (154 lbs) and have maximum dimensions of 120cm x 80cm x 80cm. For larger or heavier items, please contact our customer service for special handling arrangements."
        },
        {
          question: "Can I schedule a pickup?",
          answer: "Yes, we offer scheduled pickup services for businesses and individuals. You can schedule a pickup through your account dashboard or by contacting our customer service team. Pickup times are typically available Monday through Friday during business hours."
        }
      ]
    },
    {
      title: "Tracking & Status",
      icon: "📍",
      questions: [
        {
          question: "How can I track my shipment?",
          answer: "You can track your shipment using the tracking number provided at the time of booking. Simply enter your tracking number in the Track section on our homepage or visit the tracking page. You'll receive real-time updates on your shipment's location and status."
        },
        {
          question: "What does 'In Transit' mean?",
          answer: "'In Transit' means your package has been picked up and is on its way to the destination. It's currently being transported through our network and will be delivered according to the estimated delivery date."
        },
        {
          question: "Why hasn't my tracking updated?",
          answer: "Tracking updates may be delayed during transit, especially for international shipments or when packages are in customs. Updates typically occur when the package is scanned at sorting facilities or hubs. If you haven't seen an update in 48 hours, please contact our customer service."
        },
        {
          question: "Can I get SMS or email notifications?",
          answer: "Yes, you can opt-in to receive SMS and email notifications for tracking updates. You can manage your notification preferences in your account settings or provide your contact information when creating a shipment."
        }
      ]
    },
    {
      title: "Packaging & Insurance",
      icon: "🛡️",
      questions: [
        {
          question: "What packaging materials do you provide?",
          answer: "We offer various packaging options including boxes, envelopes, and padded mailers. You can purchase packaging materials at our branches or through our online store. We also provide free packaging for certain service types."
        },
        {
          question: "Do you offer insurance?",
          answer: "Yes, we offer shipping insurance to protect your valuable items. Insurance coverage can be added during the booking process. Standard coverage is included up to a certain value, and additional insurance can be purchased for higher-value items."
        },
        {
          question: "What happens if my package is lost or damaged?",
          answer: "If your package is lost or damaged, please contact our customer service immediately. We'll investigate the claim and process compensation according to our insurance policy. Make sure to keep all packaging and documentation for the claim process."
        },
        {
          question: "Are there items I cannot ship?",
          answer: "Yes, we have restrictions on certain items including hazardous materials, perishables, cash, firearms, and illegal substances. Please review our prohibited items list or contact customer service if you're unsure about shipping a specific item."
        }
      ]
    },
    {
      title: "Payment & Billing",
      icon: "💳",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods including credit cards (Visa, Mastercard, American Express), debit cards, bank transfers, and cash payments at our branches. Business customers can also set up invoicing and payment terms."
        },
        {
          question: "When will I be charged?",
          answer: "For individual shipments, payment is processed at the time of booking. For business accounts with payment terms, invoices are typically sent monthly and payment is due within the agreed terms (usually 30 days)."
        },
        {
          question: "Can I get a refund if I cancel my shipment?",
          answer: "Refund policies vary depending on the service type and cancellation timing. If you cancel before the package is picked up, you may be eligible for a full or partial refund. Once the package is in transit, cancellation and refund policies apply. Please contact customer service for specific cases."
        },
        {
          question: "Do you offer volume discounts for businesses?",
          answer: "Yes, we offer competitive volume discounts for business customers. Discounts are based on shipping volume and can be customized to your needs. Contact our sales team to discuss business pricing and set up a business account."
        }
      ]
    },
    {
      title: "Account & Services",
      icon: "👤",
      questions: [
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking the 'Sign Up' button on our website. You'll need to provide basic information including your name, email, phone number, and address. Business accounts require additional verification and can be set up by contacting our sales team."
        },
        {
          question: "What are the benefits of having an account?",
          answer: "Account holders enjoy benefits such as faster checkout, order history, saved addresses, exclusive discounts, priority customer support, and access to business shipping solutions. You can also manage multiple shipments and track everything in one place."
        },
        {
          question: "Can I ship without creating an account?",
          answer: "Yes, you can create a shipment as a guest without creating an account. However, creating an account provides additional benefits and makes future shipments faster and more convenient."
        },
        {
          question: "How do I update my account information?",
          answer: "You can update your account information by logging into your account and navigating to the 'Account Settings' section. You can update your personal information, addresses, payment methods, and notification preferences."
        }
      ]
    },
    {
      title: "Business Services",
      icon: "🏢",
      questions: [
        {
          question: "What business shipping solutions do you offer?",
          answer: "We offer comprehensive business solutions including volume discounts, dedicated account managers, API integration, custom invoicing, advanced analytics, priority processing, and 24/7 support. Visit our Business Shipment page to learn more about our business offerings."
        },
        {
          question: "Do you offer API integration?",
          answer: "Yes, we provide API integration for businesses that need to automate their shipping processes. Our API allows you to create shipments, generate labels, track packages, and manage your shipping operations programmatically. Contact our technical team for API documentation and setup."
        },
        {
          question: "Can I get custom reporting and analytics?",
          answer: "Yes, business account holders have access to advanced reporting and analytics. You can track shipping costs, volume trends, delivery performance, and generate custom reports. Enterprise customers can also get dedicated analytics dashboards."
        },
        {
          question: "What are your business account requirements?",
          answer: "Business accounts are available for companies that ship regularly. Requirements typically include a minimum monthly shipping volume, business registration documents, and credit verification. Contact our sales team to discuss your specific needs and eligibility."
        }
      ]
    }
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
                  <HelpCircle className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Find answers to common questions about our shipping services, tracking, payments, and more.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for questions..."
                    className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-primary/20 focus:border-primary focus:outline-none bg-white shadow-lg"
                    id="faq-search"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-2 border-primary/10 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">{category.icon}</span>
                      <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem 
                          key={faqIndex} 
                          value={`item-${categoryIndex}-${faqIndex}`}
                          className="border-b border-primary/10 last:border-b-0"
                        >
                          <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors py-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white to-primary/5">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-primary/10">
                      <MessageCircle className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Still Have Questions?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Can't find the answer you're looking for? Our friendly customer service team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                      <Link href="mailto:support@nge.com">
                        <Mail className="w-5 h-5 mr-2" />
                        Email Support
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg px-8 border-2">
                      <Link href="tel:+1234567890">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Call Us
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-12 bg-white border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-6">Quick Links</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="justify-start h-auto py-4">
                  <Link href="/track">
                    <Search className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Track Shipment</div>
                      <div className="text-xs text-muted-foreground">Track your package</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start h-auto py-4">
                  <Link href="/business-shipment">
                    <Search className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Business Solutions</div>
                      <div className="text-xs text-muted-foreground">For businesses</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
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

