import { Truck } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[100]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center h-20 w-20">
            <div className="absolute inline-flex h-full w-full rounded-full bg-primary/50 animate-ping-slow opacity-75"></div>
            <div className="relative inline-flex items-center justify-center rounded-full h-16 w-16 bg-primary text-primary-foreground">
                <Truck className="h-8 w-8" />
            </div>
        </div>
        <p className="text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
