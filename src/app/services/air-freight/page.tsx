import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AirFreightPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-primary">NEXT GLOBAL EXPRESS</Link>
                    <Button asChild variant="outline">
                        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Home</Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <Image 
                            src="https://images.unsplash.com/photo-1610967919077-d3c0369352a5?q=80&w=2070&auto=format&fit=crop"
                            alt="Air Freight"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                            data-ai-hint="cargo plane"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Air Freight Services</h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            When time is of the essence, our air freight services provide a fast and reliable solution for your cargo. We connect major global hubs to ensure your shipments arrive on schedule, every time.
                        </p>
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Features</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-1 text-primary" />
                                    <div>
                                        <p className="font-semibold">Speed and Efficiency</p>
                                        <p className="text-sm text-muted-foreground">Ideal for urgent and time-sensitive deliveries.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-1 text-primary" />
                                    <div>
                                        <p className="font-semibold">Global Network</p>
                                        <p className="text-sm text-muted-foreground">Extensive network of destinations worldwide.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-1 text-primary" />
                                    <div>
                                        <p className="font-semibold">High Security</p>
                                        <p className="text-sm text-muted-foreground">Strict security measures ensure your cargo is safe.</p>
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
