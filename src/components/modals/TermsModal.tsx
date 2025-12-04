// src/components/modals/TermsModal.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import React from 'react';

/**
 * Props for the TermsModal component.
 * @typedef {object} TermsModalProps
 * @property {boolean} open - Controls whether the modal is visible.
 * @property {(open: boolean) => void} onOpenChange - Handler called when the modal's open state changes (e.g., when the user closes it).
 * @property {() => void} onAccept - Handler called when the user explicitly clicks the 'Accept' button.
 */
interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

/**
 * A modal component to display the Terms and Conditions for the user to review and accept.
 *
 * @param {TermsModalProps} props - The component props.
 * @returns {JSX.Element} The TermsModal component.
 */
export default function TermsModal({ open, onOpenChange, onAccept }: TermsModalProps): JSX.Element {
  
  const handleAccept = () => {
    onAccept(); // Call the acceptance handler
    onOpenChange(false); // Close the modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FileText className="h-6 w-6 text-primary" />
            الشروط والأحكام وسياسة الخصوصية
          </DialogTitle>
          <DialogDescription>
            يرجى قراءة الوثيقة التالية بعناية قبل الموافقة والمتابعة.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300" dir="rtl">
            
            {/* --- Section 1: Introduction --- */}
            <section className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-1">1. مقدمة</h3>
                <p>
                    نرحب بك في متجرنا. باستخدامك لهذا المتجر، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة هنا. في حال عدم موافقتك على أي من هذه الشروط، يرجى عدم استخدام المتجر.
                </p>
            </section>

            {/* --- Section 2: Product and Pricing --- */}
            <section className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-1">2. المنتجات والتسعير</h3>
                <ul className="list-disc pr-5 space-y-1">
                    <li>جميع أسعار المنتجات بالريال السعودي (ر.س) وتشمل ضريبة القيمة المضافة (VAT) بنسبة 15%، ما لم يُذكر خلاف ذلك.</li>
                    <li>قد تختلف أسعار وتوافر المنتجات دون إشعار مسبق.</li>
                    <li>نحتفظ بالحق في رفض أو إلغاء أي طلب يحتوي على سعر غير صحيح أو خطأ في وصف المنتج.</li>
                </ul>
            </section>

            {/* --- Section 3: Shipping and Delivery --- */}
            <section className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-1">3. الشحن والتوصيل</h3>
                <ul className="list-disc pr-5 space-y-1">
                    <li>يتم تحديد مدة الشحن المتوقعة عند إتمام عملية الدفع وهي تقديرية وليست مضمونة.</li>
                    <li>تقع مسؤولية التأكد من صحة عنوان التوصيل على العميل.</li>
                    <li>في حال الدفع عند الاستلام، يرجى تجهيز المبلغ المطلوب لضمان سرعة إتمام عملية التسليم.</li>
                </ul>
            </section>

            {/* --- Section 4: Return and Exchange Policy --- */}
            <section className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-1">4. سياسة الإرجاع والاستبدال</h3>
                <ul className="list-disc pr-5 space-y-1">
                    <li>يجب تقديم طلب الإرجاع أو الاستبدال خلال 3 أيام من تاريخ استلام المنتج.</li>
                    <li>يجب أن تكون المنتجات في حالتها الأصلية، غير مستخدمة، ومعها جميع الملصقات والتغليف.</li>
                    <li>بعض المنتجات (مثل المواد الغذائية أو المنتجات التي تُصنع حسب الطلب) قد تكون غير قابلة للإرجاع أو الاستبدال.</li>
                </ul>
            </section>

            {/* --- Section 5: Privacy Policy Summary --- */}
            <section className="space-y-2">
                <h3 className="text-lg font-semibold text-primary border-b pb-1">5. سياسة الخصوصية (ملخص)</h3>
                <ul className="list-disc pr-5 space-y-1">
                    <li>نقوم بجمع بياناتك الشخصية (الاسم، العنوان، الهاتف) فقط لغرض معالجة طلباتك وتحسين تجربتك.</li>
                    <li>لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية.</li>
                    <li>تُحفظ جميع بيانات الدفع المشفرة (إذا تم استخدام بطاقة ائتمانية) بواسطة مزود خدمة الدفع المعتمد ولا يتم تخزينها على خوادمنا.</li>
                </ul>
            </section>
            
          </div>
        </ScrollArea>
        
        {/* Footer with Action Button */}
        <DialogFooter className="p-6 pt-4 border-t flex justify-end">
          <Button type="button" onClick={() => onOpenChange(false)} variant="outline" className="ml-2">
            إغلاق
          </Button>
          <Button type="button" onClick={handleAccept} className="bg-green-600 hover:bg-green-700">
            أوافق على الشروط والأحكام
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}