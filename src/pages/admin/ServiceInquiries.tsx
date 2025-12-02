import { useEffect, useState } from 'react';
import { Eye, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { ServiceInquiry, Service } from '@/types';

export default function ServiceInquiries() {
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ServiceInquiry | null>(null);
  const [deletingInquiry, setDeletingInquiry] = useState<ServiceInquiry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inquiriesData, servicesData] = await Promise.all([
        api.getServiceInquiries(),
        api.getServices(),
      ]);
      setInquiries(inquiriesData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الاستفسارات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name_ar || 'Unknown Service';
  };

  const handleView = (inquiry: ServiceInquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingInquiry) return;

    try {
      await api.deleteServiceInquiry(deletingInquiry.id);
      toast({
        title: 'نجح',
        description: 'تم حذف الاستفسار بنجاح',
      });
      setDeleteDialogOpen(false);
      setDeletingInquiry(null);
      loadData();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف الاستفسار',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Inquiries</h1>
          <p className="text-muted-foreground">Manage customer service inquiries</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {inquiries.length} Total Inquiries
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No inquiries yet. They will appear here when customers submit service inquiries.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">
                      {getServiceName(inquiry.service_id)}
                    </TableCell>
                    <TableCell>{inquiry.customer_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(inquiry.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(inquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingInquiry(inquiry);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Inquiry Details</DialogTitle>
            <DialogDescription>
              Inquiry submitted on {selectedInquiry && formatDate(selectedInquiry.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Service</h3>
                <p className="text-muted-foreground">{getServiceName(selectedInquiry.service_id)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Customer Name</h3>
                  <p className="text-muted-foreground">{selectedInquiry.customer_name}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">{selectedInquiry.email}</p>
                </div>
              </div>

              {selectedInquiry.phone && (
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">{selectedInquiry.phone}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-1">Message</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedInquiry.email}`, '_blank')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                {selectedInquiry.phone && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${selectedInquiry.phone}`, '_blank')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the inquiry from "{deletingInquiry?.customer_name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
