"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Globe } from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Our Services', href: '/services/air-freight' },
    { name: 'Careers', href: '#' },
    { name: 'Contact Us', href: '#' }
  ],
  services: [
    { name: 'Air Freight', href: '/services/air-freight' },
    { name: 'Track Shipment', href: '/track' }
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Shipping Guide', href: '#' },
    { name: 'Terms & Conditions', href: '#' }
  ]
};

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const socialLinks = [
  { 
    icon: Facebook, 
    href: 'https://facebook.com/nextglobalexpress', 
    label: 'Facebook',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  { 
    icon: Instagram, 
    href: 'https://instagram.com/nextglobalexpress', 
    label: 'Instagram',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  { 
    icon: TikTokIcon, 
    href: 'https://tiktok.com/nextglobalexpress', 
    label: 'TikTok',
    target: '_blank',
    rel: 'noopener noreferrer'
  }
];

export function EnhancedFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H0v-2h20zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/hero-images/NEXT LOGO.jpg"
                  alt="Next Global Express logo"
                  width={200}
                  height={62}
                  className="h-14 w-auto"
                  priority
                />
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEXT GLOBAL EXPRESS
                </span>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Connecting businesses worldwide with reliable, fast, and secure logistics solutions. 
              Your trusted partner for global shipping and freight services.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Warehouse 42, Al Quoz Industrial Area 3<br />
                    Dubai, UAE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <a href="tel:+971501234567" className="text-gray-300 hover:text-violet-400 transition-colors">
                  +971 50 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <a href="mailto:customercare@nge.ae" className="text-gray-300 hover:text-violet-400 transition-colors">
                  customercare@nge.ae
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-violet-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-violet-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-violet-400 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.target}
                    rel={social.rel}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-violet transition-colors flex items-center justify-center group"
                  >
                    {social.label === 'TikTok' ? (
                      <TikTokIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                    ) : (
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                    )}
                  </a>
                );
              })}
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Next Global Express. All rights reserved.</p>
              <p className="mt-1">Designed with ❤️ by Bushra Technologies</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


