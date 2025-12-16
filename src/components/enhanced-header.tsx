"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EnhancedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-gradient-violet text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+971501234567" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>+971 50 123 4567</span>
            </a>
            <a href="mailto:customercare@nge.ae" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="w-4 h-4" />
              <span>customercare@nge.ae</span>
            </a>
          </div>
          <div className="text-xs">
            Operating Hours: 9 AM - 6 PM (UAE Time)
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/hero-images/NEXT LOGO.jpg"
              alt="Next Global Express logo"
              width={180}
              height={56}
              className="h-8 sm:h-10 md:h-12 w-auto transition-transform group-hover:scale-105"
              priority
            />
            <span className="ml-2 sm:ml-3 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-colors">
              <span className="hidden sm:inline">NEXT GLOBAL EXPRESS</span>
              <span className="sm:hidden">NGE</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-violet-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/track" className="text-foreground hover:text-violet-400 transition-colors font-medium">
              Track
            </Link>
            <Button asChild className="bg-gradient-violet hover:opacity-90">
              <Link href="/track">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <Link 
              href="/" 
              className="block text-foreground hover:text-violet-400 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/track" 
              className="block text-foreground hover:text-violet-400 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Track
            </Link>
            <Button asChild className="w-full bg-gradient-violet hover:opacity-90">
              <Link href="/track" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}

