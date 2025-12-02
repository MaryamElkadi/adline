import { useState, useEffect } from 'react';
import { FileText, Eye, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { QuoteRequest } from '@/types';

export default function QuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadQuoteRequests();
  }, []);

  const loadQuoteRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getQuoteRequests();
      setQuoteRequests(data);
    } catch (error) {
      toast({
        title: 'خطأ في تحميل الطلبات',
        description: 'حدث خطأ أثناء تحميل طلبات التسعير',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setStatus(request.status);
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      await api.updateQuoteRequest(selectedRequest.id, {
        status: status as QuoteRequest['status'],
        admin_notes: adminNotes || null,
      });

      toast({
        title: 'تم تحديث الطلب',
        description: 'تم تحديث حالة الطلب بنجاح',
      });

      loadQuoteRequests();
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث الطلب',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      await api.deleteQuoteRequest(id);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الطلب بنجاح',
      });
      loadQuoteRequests();
    } catch (error) {
      toast({
        title: 'خطأ في الحذف',
        description: 'حدث خطأ أثناء حذف الطلب',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد الانتظار', variant: 'secondary' as const, icon: Clock },
      reviewed: { label: 'تمت المراجعة', variant: 'default' as const, icon: Eye },
      quoted: { label: 'تم التسعير', variant: 'default' as const, icon: CheckCircle },
      completed: { label: 'مكتمل', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'ملغي', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredRequests = filterStatus === 'all' 
    ? quoteRequests 
    : quoteRequests.filter(req => req.status === filterStatus);

  const stats = {
    total: quoteRequests.length,
    pending: quoteRequests.filter(r => r.status === 'pending').length,
    reviewed: quoteRequests.filter(r => r.status === 'reviewed').length,
    quoted: quoteRequests.filter(r => r.status === 'quoted').length,
    completed: quoteRequests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">طلبات التسعير</h1>
          <p className="text-muted-foreground mt-1">
            إدارة ومتابعة طلبات التسعير من العملاء
          </p>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              قيد الانتظار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تمت المراجعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تم التسعير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.quoted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              مكتمل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* فلتر الحالة */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>قائمة الطلبات</CardTitle>
              <CardDescription>عرض وإدارة جميع طلبات التسعير</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="reviewed">تمت المراجعة</SelectItem>
                <SelectItem value="quoted">تم التسعير</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد طلبات تسعير</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>نوع المشروع</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.project_type || '-'}</TableCell>
                      <TableCell>{request.quantity || '-'}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewRequest(request)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>تفاصيل طلب التسعير</DialogTitle>
                                <DialogDescription>
                                  عرض وتحديث معلومات الطلب
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedRequest && (
                                <div className="space-y-4">
                                  {/* معلومات العميل */}
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">معلومات العميل</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">الاسم:</span>
                                        <p className="font-medium">{selectedRequest.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">البريد:</span>
                                        <p className="font-medium">{selectedRequest.email}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">الهاتف:</span>
                                        <p className="font-medium">{selectedRequest.phone || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">الشركة:</span>
                                        <p className="font-medium">{selectedRequest.company || '-'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* تفاصيل المشروع */}
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">تفاصيل المشروع</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">نوع المشروع:</span>
                                        <p className="font-medium">{selectedRequest.project_type || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">الكمية:</span>
                                        <p className="font-medium">{selectedRequest.quantity || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">الميزانية:</span>
                                        <p className="font-medium">{selectedRequest.budget_range || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">الموعد المطلوب:</span>
                                        <p className="font-medium">
                                          {selectedRequest.deadline 
                                            ? new Date(selectedRequest.deadline).toLocaleDateString('ar-SA')
                                            : '-'}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">الوصف:</span>
                                      <p className="mt-1 p-3 bg-muted rounded-md">
                                        {selectedRequest.description}
                                      </p>
                                    </div>
                                  </div>

                                  {/* تحديث الحالة */}
                                  <div className="space-y-2">
                                    <Label htmlFor="status">الحالة</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                      <SelectTrigger id="status">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                                        <SelectItem value="reviewed">تمت المراجعة</SelectItem>
                                        <SelectItem value="quoted">تم التسعير</SelectItem>
                                        <SelectItem value="completed">مكتمل</SelectItem>
                                        <SelectItem value="cancelled">ملغي</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* ملاحظات الإدارة */}
                                  <div className="space-y-2">
                                    <Label htmlFor="adminNotes">ملاحظات الإدارة</Label>
                                    <Textarea
                                      id="adminNotes"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      placeholder="أضف ملاحظات داخلية..."
                                      rows={4}
                                    />
                                  </div>

                                  {/* أزرار الإجراءات */}
                                  <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedRequest(null)}
                                    >
                                      إلغاء
                                    </Button>
                                    <Button onClick={handleUpdateRequest}>
                                      حفظ التغييرات
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
