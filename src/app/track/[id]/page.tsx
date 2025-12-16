"use client"

import { useState, useEffect } from 'react';
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from '@/components/enhanced-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrackingTimeline } from '@/components/tracking-timeline';
import type { ShipmentHistory, ShipmentStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Calendar, MapPin, Package, User, FileText, Weight, Truck, CheckCircle2, Clock, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest, getApiUrl } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function TrackShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const trackingId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to find by orderNumber first, then by trackingId, then by order ID
        const response = await apiRequest(`/orders/track/${encodeURIComponent(trackingId)}`, {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Order or shipment not found');
            return;
          }
          throw new Error(`Failed to fetch tracking data: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          setError(result.error?.message || 'Failed to fetch tracking data');
          return;
        }

        // Handle response - could be order or shipment
        if (result.data) {
          if (result.data.order) {
            setOrder(result.data.order);
          }
          if (result.data.shipment) {
            setShipment(result.data.shipment);
          }
          // If data is directly an order or shipment
          if (result.data.orderNumber || result.data._id) {
            setOrder(result.data);
          }
          if (result.data.trackingId || result.data.batchNumber) {
            setShipment(result.data);
          }
        }
      } catch (err: any) {
        console.error('Error fetching tracking data:', err);
        setError(err.message || 'Failed to load tracking information');
      } finally {
        setLoading(false);
      }
    };

    if (trackingId) {
      fetchTrackingData();
    }
  }, [trackingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <EnhancedHeader />
        <div className="flex-grow flex items-center justify-center text-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5 pt-20">
          <Card className="w-full max-w-md shadow-xl border-2 border-violet-300/30">
            <CardContent className="p-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-violet-600 animate-spin" />
                <p className="text-lg font-medium">Loading tracking information...</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <EnhancedFooter />
      </div>
    );
  }

  if (error || (!order && !shipment)) {
    return (
      <div className="flex min-h-screen flex-col">
        <EnhancedHeader />
        <div className="flex-grow flex items-center justify-center text-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/5 pt-20">
          <Card className="w-full max-w-md shadow-xl border-2 border-destructive/20 animate-fade-in">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="mt-4 text-2xl">Tracking Not Found</CardTitle>
              <CardDescription className="text-base mt-2">
                The tracking ID <span className="font-mono font-semibold">"{trackingId}"</span> is not valid. Please check the ID and try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gradient-violet hover:opacity-90">
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

  // Use order data if available, otherwise use shipment
  const displayData = order || shipment;
  const isOrder = !!order;
  const trackingNumber = order?.orderNumber || shipment?.trackingId || shipment?.batchNumber || trackingId;
  const status = (order?.status || shipment?.currentStatus || shipment?.status || 'pending').toLowerCase();
  
  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'completed') return 'default';
    if (s === 'cancelled' || s === 'on hold') return 'destructive';
    if (s === 'in_transit' || s === 'in transit' || s === 'processing') return 'secondary';
    return 'outline';
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'completed') return 'bg-green-500';
    if (s === 'cancelled' || s === 'on hold') return 'bg-red-500';
    if (s === 'in_transit' || s === 'in transit') return 'bg-blue-500';
    if (s === 'out_for_delivery' || s === 'out for delivery') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const s = status.toLowerCase();
    const statusMap: Record<string, string> = {
      'pending': 'Shipment Received',
      'processing': 'Shipment Received',
      'confirmed': 'Confirmed',
      'in_transit': 'In Transit',
      'in transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'out for delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
    };
    return statusMap[s] || status;
  };

  // Build history from order or shipment - transform to TrackingTimeline format
  const buildHistory = (): ShipmentHistory[] => {
    const historyArray: ShipmentHistory[] = [];
    
    // Map status to valid ShipmentStatus
    const mapStatus = (statusStr: string): 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'On Hold' => {
      const s = statusStr.toLowerCase();
      if (s.includes('delivered') || s.includes('completed')) return 'Delivered';
      if (s.includes('transit')) return 'In Transit';
      if (s.includes('delivery')) return 'Out for Delivery';
      if (s.includes('hold') || s.includes('cancelled')) return 'On Hold';
      return 'Processing';
    };
    
    // Get current status mapped
    const currentMappedStatus = mapStatus(status);
    
    // Transform shipment history
    if (shipment?.history && Array.isArray(shipment.history)) {
      shipment.history.forEach((item: any) => {
        const statusValue = item.status || item.currentStatus || status;
        historyArray.push({
          status: mapStatus(statusValue),
          date: item.timestamp || item.updatedAt || item.date || new Date().toISOString(),
          location: item.location || 'N/A',
          notes: item.notes || ''
        });
      });
    }
    
    // Transform order status history
    if (order?.statusHistory && Array.isArray(order.statusHistory)) {
      order.statusHistory.forEach((item: any) => {
        const statusValue = item.status || status;
        historyArray.push({
          status: mapStatus(statusValue),
          date: item.updatedAt || item.date || new Date().toISOString(),
          location: item.location || 'N/A',
          notes: item.notes || ''
        });
      });
    }
    
    // If no history, create a default entry from current status
    if (historyArray.length === 0) {
      historyArray.push({
        status: currentMappedStatus,
        date: order?.updatedAt || shipment?.updatedAt || order?.createdAt || shipment?.createdAt || new Date().toISOString(),
        location: 'N/A',
        notes: ''
      });
    } else {
      // Ensure the most recent entry matches the current status
      // Sort by date first
      historyArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Check if the most recent entry matches current status
      const mostRecent = historyArray[0];
      const mostRecentMappedStatus = mapStatus(mostRecent.status as string);
      
      // If the most recent entry doesn't match current status, update it or add a new entry
      if (mostRecentMappedStatus !== currentMappedStatus) {
        // Update the most recent entry to current status, or add new entry if dates are different
        const currentDate = order?.updatedAt || shipment?.updatedAt || new Date().toISOString();
        const mostRecentDate = new Date(mostRecent.date).getTime();
        const currentDateTime = new Date(currentDate).getTime();
        
        // If dates are significantly different, add a new entry
        if (Math.abs(currentDateTime - mostRecentDate) > 60000) { // More than 1 minute difference
          historyArray.unshift({
            status: currentMappedStatus,
            date: currentDate,
            location: 'N/A',
            notes: ''
          });
        } else {
          // Update the most recent entry
          historyArray[0] = {
            ...mostRecent,
            status: currentMappedStatus
          };
        }
      }
    }
    
    // Final sort by date (newest first)
    return historyArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const history = buildHistory();
  const currentStatusLabel = getStatusLabel(status);
  
  // Map current status to ShipmentStatus type for TrackingTimeline
  const mapToShipmentStatus = (statusStr: string): ShipmentStatus => {
    const s = statusStr.toLowerCase();
    if (s.includes('delivered') || s.includes('completed')) return 'Delivered';
    if (s.includes('transit')) return 'In Transit';
    if (s.includes('delivery')) return 'Out for Delivery';
    if (s.includes('hold') || s.includes('cancelled')) return 'On Hold';
    return 'Processing';
  };
  
  const currentStatusForTimeline: ShipmentStatus = mapToShipmentStatus(status);

  // Get customer/shipper info
  const customer = order?.customerId || shipment?.shipper || {};
  const receiver = shipment?.receiver || customer;
  const customerName = customer?.firstName && customer?.lastName 
    ? `${customer.firstName} ${customer.lastName}`
    : customer?.name || customer?.email || 'N/A';

  // Get items/parcels
  const items = order?.items || shipment?.parcels || [];
  const totalWeight = items.reduce((acc: number, item: any) => {
    const weight = parseFloat(item.weight || item.quantity || 0);
    return acc + (isNaN(weight) ? 0 : weight);
  }, 0);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Set up PDF content
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      
      // Company Header
      doc.setFontSize(20);
      doc.setTextColor(139, 92, 246); // Violet color
      doc.text('NEXT GLOBAL EXPRESS', margin, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Tracking Information', margin, yPos);
      yPos += 15;
      
      // Tracking Number
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${isOrder ? 'Order Number' : 'Tracking Number'}:`, margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(trackingNumber, margin + 60, yPos);
      yPos += 10;
      
      // Status
      doc.setFont('helvetica', 'bold');
      doc.text('Status:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(currentStatusLabel, margin + 30, yPos);
      yPos += 10;
      
      // Customer Information
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information:', margin, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${customerName}`, margin, yPos);
      yPos += 7;
      if (customer?.email) {
        doc.text(`Email: ${customer.email}`, margin, yPos);
        yPos += 7;
      }
      if (customer?.phone) {
        doc.text(`Phone: ${customer.phone}`, margin, yPos);
        yPos += 7;
      }
      if (customer?.address) {
        const addressLines = doc.splitTextToSize(`Address: ${customer.address}`, maxWidth - margin);
        doc.text(addressLines, margin, yPos);
        yPos += addressLines.length * 7;
      }
      yPos += 5;
      
      // Receiver Information
      if (receiver && (receiver.firstName || receiver.name)) {
        doc.setFont('helvetica', 'bold');
        doc.text('Receiver Information:', margin, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        const receiverName = receiver.firstName && receiver.lastName 
          ? `${receiver.firstName} ${receiver.lastName}`
          : receiver.name || receiver.email || 'N/A';
        doc.text(`Name: ${receiverName}`, margin, yPos);
        yPos += 7;
        if (receiver.address) {
          const receiverAddressLines = doc.splitTextToSize(`Address: ${receiver.address}`, maxWidth - margin);
          doc.text(receiverAddressLines, margin, yPos);
          yPos += receiverAddressLines.length * 7;
        }
        yPos += 5;
      }
      
      // Dates
      if (order?.departureDate || shipment?.departureDate) {
        doc.setFont('helvetica', 'bold');
        doc.text('Departure Date:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(
          new Date(order?.departureDate || shipment?.departureDate).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          margin + 50,
          yPos
        );
        yPos += 10;
      }
      
      if (order?.createdAt || shipment?.createdAt) {
        doc.setFont('helvetica', 'bold');
        doc.text('Order Date:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(
          new Date(order?.createdAt || shipment?.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          margin + 50,
          yPos
        );
        yPos += 10;
      }
      
      // Items/Parcels
      if (items.length > 0) {
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(`${isOrder ? 'Order Items' : 'Cargo Details'}:`, margin, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        
        items.forEach((item: any, index: number) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont('helvetica', 'bold');
          doc.text(`${isOrder ? 'Item' : 'Parcel'} ${index + 1}:`, margin, yPos);
          yPos += 7;
          doc.setFont('helvetica', 'normal');
          if (item.description || item.items) {
            const descLines = doc.splitTextToSize(`Description: ${item.description || item.items}`, maxWidth - margin);
            doc.text(descLines, margin, yPos);
            yPos += descLines.length * 7;
          }
          if (item.quantity || item.weight) {
            doc.text(`${item.quantity ? 'Quantity' : 'Weight'}: ${item.quantity || item.weight}`, margin, yPos);
            yPos += 7;
          }
          yPos += 5;
        });
      }
      
      // Tracking History
      if (history.length > 0) {
        yPos += 5;
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Tracking History:', margin, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        
        history.forEach((event, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          const statusText = event.status === 'Processing' ? 'Shipment Received' : event.status;
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${statusText}`, margin, yPos);
          yPos += 7;
          doc.setFont('helvetica', 'normal');
          doc.text(`Date: ${new Date(event.date).toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          })}`, margin + 5, yPos);
          yPos += 7;
          if (event.location && event.location !== 'N/A') {
            doc.text(`Location: ${event.location}`, margin + 5, yPos);
            yPos += 7;
          }
          if (event.notes) {
            const notesLines = doc.splitTextToSize(`Notes: ${event.notes}`, maxWidth - margin - 5);
            doc.text(notesLines, margin + 5, yPos);
            yPos += notesLines.length * 7;
          }
          yPos += 5;
        });
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `Generated on ${new Date().toLocaleDateString('en-US')}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 5,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`Tracking-${trackingNumber}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error.message?.includes('jspdf') 
          ? "PDF library not found. Please install jspdf: npm install jspdf"
          : "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-br from-violet-50 via-purple-50/30 to-pink-50/20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-50 to-purple-50 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-50 to-purple-50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
              <Card className="border-2 border-violet-300/30 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {isOrder ? 'Order Number' : 'Tracking Number'}
                      </p>
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-violet-600 tracking-wider font-mono break-all">
                        {trackingNumber}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Badge 
                        variant={getStatusVariant(status)} 
                        className="text-xs sm:text-sm md:text-base font-semibold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 flex items-center gap-2"
                      >
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} animate-pulse`}></div>
                        <span className="whitespace-nowrap">{currentStatusLabel}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:bg-gradient-to-br from-violet-100 to-purple-100 transition-colors group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 group-hover:bg-primary/20 transition-colors">
                      <User className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Customer</p>
                      <p className="text-sm font-medium text-foreground">{customerName}</p>
                    </div>
                  </div>
                  {order?.departureDate || shipment?.departureDate ? (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:bg-gradient-to-br from-violet-100 to-purple-100 transition-colors group">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 group-hover:bg-primary/20 transition-colors">
                        <Calendar className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Departure</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(order?.departureDate || shipment?.departureDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {order?.createdAt || shipment?.createdAt ? (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:bg-gradient-to-br from-violet-100 to-purple-100 transition-colors group">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 group-hover:bg-primary/20 transition-colors">
                        <Clock className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Order Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(order?.createdAt || shipment?.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {totalWeight > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:bg-gradient-to-br from-violet-100 to-purple-100 transition-colors group">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 group-hover:bg-primary/20 transition-colors">
                        <Weight className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Total Items</p>
                        <p className="text-sm font-medium text-foreground">{items.length} items</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Left Column - Timeline */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <Card className="border-2 border-violet-300/30 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Truck className="w-6 h-6 text-violet-600" />
                        {isOrder ? 'Order History' : 'Shipment History'}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {history.length > 0 ? (
                      <TrackingTimeline history={history} currentStatus={currentStatusForTimeline} />
                    ) : (
                      <div className="py-8 text-center">
                        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No tracking history available yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Status: {currentStatusLabel}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order/Item Details */}
                {items.length > 0 && (
                  <Card className="border-2 border-violet-300/30 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Package className="w-6 h-6 text-violet-600" />
                        {isOrder ? 'Order Items' : 'Cargo Details'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {items.map((item: any, index: number) => (
                          <div 
                            key={index} 
                            className="p-4 rounded-lg border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/30 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide">
                                {isOrder ? `Item ${index + 1}` : `Parcel ${index + 1}`}
                              </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
                                  <FileText className="w-4 h-4 text-violet-600" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                                  <p className="text-sm font-medium text-foreground">
                                    {item.description || item.items || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              {(item.quantity || item.weight) && (
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
                                    <Weight className="w-4 h-4 text-violet-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                      {item.quantity ? 'Quantity' : 'Weight'}
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                      {item.quantity || item.weight || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Info Cards */}
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Info */}
                <Card className="border-2 border-violet-300/30 shadow-xl lg:sticky lg:top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {receiver && (receiver.firstName || receiver.name) && (
                      <>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Receiver</p>
                          <p className="text-sm font-medium">
                            {receiver.firstName && receiver.lastName 
                              ? `${receiver.firstName} ${receiver.lastName}`
                              : receiver.name || receiver.email || 'N/A'}
                          </p>
                          {receiver.address && (
                            <p className="text-xs text-muted-foreground">{receiver.address}</p>
                          )}
                        </div>
                        <Separator />
                      </>
                    )}
                    {order?.orderNumber && (
                      <>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order Number</p>
                          <p className="text-sm font-mono font-medium">{order.orderNumber}</p>
                        </div>
                        <Separator />
                      </>
                    )}
                    {shipment?.batchNumber && (
                      <>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Batch Number</p>
                          <p className="text-sm font-mono font-medium">{shipment.batchNumber}</p>
                        </div>
                        <Separator />
                      </>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={handleDownloadPDF}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Card */}
                <Card className="border-2 border-violet-300/30 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-violet-600" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Questions about your {isOrder ? 'order' : 'shipment'}? Our support team is here to help.
                    </p>
                    <Button asChild className="w-full bg-gradient-violet hover:opacity-90">
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
