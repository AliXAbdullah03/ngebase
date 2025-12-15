import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandTransportPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="inline-flex items-center">
                        <Image
                            src="/hero-images/NEXT LOGO.jpg"
                            alt="Next Global Express logo"
                            width={180}
                            height={56}
                            className="h-12 w-auto"
                            priority
                        />
                        <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            NEXT GLOBAL EXPRESS
                        </span>
                    </Link>
                    <Button asChild variant="outline">
                        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Home</Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <Image 
                            src="https://images.unsplash.com/photo-1590424940274-80ae6b643c68?q=80&w=2070&auto=format&fit=crop"
                            alt="Land Transport"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                            data-ai-hint="cargo truck"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Land Transport</h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            Our land transport services offer flexible and reliable door-to-door delivery across domestic and cross-border routes. We manage your ground shipments with precision and care.
                        </p>
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Features</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-1 text-violet-600" />
                                    <div>
                                        <p className="font-semibold">Door-to-Door Service</p>
                                        <p className="text-sm text-muted-foreground">Seamless delivery from sender to recipient.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-1 text-violet-600" />
                                    <div>
                                        <p className="font-semibold">Full & Partial Loads</p>
                                        <p className="text-sm text-muted-foreground">Solutions for both Full Truckload (FTL) and Less-than-Truckload (LTL).</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-1 text-violet-600" />
                                    <div>
                                        <p className="font-semibold">Real-Time Tracking</p>
                                        <p className="text-sm text-muted-foreground">Monitor your shipment's journey every step of the way.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} Next Global Express. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
