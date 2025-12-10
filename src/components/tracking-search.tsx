
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';

export function TrackingSearch() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center">
      <Input
        type="text"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        placeholder="Enter tracking number (e.g., NGE123456789)"
        className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-12 text-base placeholder:text-muted-foreground/60"
        aria-label="Tracking ID"
      />
      <Button 
        type="submit" 
        className="h-12 px-6 rounded-r-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
        disabled={!trackingId.trim()}
      >
        <span className="hidden sm:inline">Track</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
}
