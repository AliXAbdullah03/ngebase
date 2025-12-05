import { getShipmentById } from '@/lib/data';
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrackingTimeline } from '@/components/tracking-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  AlertCircle, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Package, 
  User, 
  FileText, 
  Weight,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  Share2
} from 'lucide-react';

export default async function TrackShipmentPage({ params }: { params: { id: string } }) {
  const shipment = await getShipmentById(params.id);

  if (!shipment) {
    return (
      <div className="flex min-h-screen flex-col">
        <EnhancedHeader />
        <div className="flex-grow flex items-center justify-center text-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5 pt-20">
          <Card className="w-full max-w-md shadow-xl border-2 border-destructive/20 animate-fade-in">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="mt-4 text-2xl">Shipment Not Found</CardTitle>
              <CardDescription className="text-base mt-2">
                The tracking ID <span className="font-mono font-semibold">"{params.id}"</span> is not valid. Please check the ID and try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/track">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tracking
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  Go to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <EnhancedFooter />
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'On Hold':
        return 'destructive';
      case 'In Transit':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'On Hold':
        return 'bg-red-500';
      case 'In Transit':
        return 'bg-blue-500';
      case 'Out for Delivery':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalWeight = shipment.parcels.reduce((acc, parcel) => {
    const weightValue = parseFloat(parcel.weight);
    return isNaN(weightValue) ? acc : acc + weightValue;
  }, 0);

  const weightUnit = shipment.parcels.length > 0 ? (shipment.parcels[0].weight.match(/[a-zA-Z]+/) || [''])[0] : '';

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="ghost" size="sm">
                <Link href="/track">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="border-2 border-primary/20 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Tracking Number</p>
                      <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-wider font-mono">
                        {shipment.id}
                      </h1>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={getStatusVariant(shipment.currentStatus)} 
                        className="text-base font-semibold px-5 py-2.5 flex items-center gap-2"
                      >
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(shipment.currentStatus)} animate-pulse`}></div>
                        {shipment.currentStatus}
                      </Badge>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Shipper</p>
                      <p className="text-sm font-medium text-foreground">{shipment.shipper.firstName} {shipment.shipper.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Route</p>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{shipment.shipper.address.split(',')[0]} → {shipment.receiver.address.split(',')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Departure</p>
                      <p className="text-sm font-medium text-foreground">{new Date(shipment.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Weight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Total Weight</p>
                      <p className="text-sm font-medium text-foreground">{totalWeight > 0 ? `${totalWeight.toFixed(2)} ${weightUnit}`: 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              {/* Left Column - Timeline */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-2 border-primary/20 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Truck className="w-6 h-6 text-primary" />
                        Shipment History
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TrackingTimeline history={shipment.history} currentStatus={shipment.currentStatus} />
                  </CardContent>
                </Card>

                {/* Cargo Details */}
                <Card className="border-2 border-primary/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Package className="w-6 h-6 text-primary" />
                      Cargo Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shipment.parcels.map((parcel, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/30 transition-all duration-300"
                          style={{ animation: `fadeIn 0.6s ease-out ${index * 0.1}s both` }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Parcel {index + 1}</p>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Items</p>
                                <p className="text-sm font-medium text-foreground">{parcel.items}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Weight className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Weight</p>
                                <p className="text-sm font-medium text-foreground">{parcel.weight}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Info Cards */}
              <div className="space-y-6">
                {/* Quick Info */}
                <Card className="border-2 border-primary/20 shadow-xl sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Receiver</p>
                      <p className="text-sm font-medium">{shipment.receiver.firstName} {shipment.receiver.lastName}</p>
                      <p className="text-xs text-muted-foreground">{shipment.receiver.address}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice Number</p>
                      <p className="text-sm font-mono font-medium">{shipment.invoiceNumber}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Batch Number</p>
                      <p className="text-sm font-mono font-medium">{shipment.batchNumber}</p>
                    </div>
                    <Separator />
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Card */}
                <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Questions about your shipment? Our support team is here to help.
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="mailto:customercare@nge.ae">
                        Contact Support
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EnhancedFooter />
    </div>
  );
}
