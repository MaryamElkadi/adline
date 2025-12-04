import { useState, useEffect } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  detectCardType,
  formatCardNumber,
  isMadaCard,
  validateCardNumber,
  validateCardholderName,
  validateExpiryDate,
  validateCVV,
} from '@/lib/creditCard';
import type { CreditCardData, CardType } from '@/types';

interface CreditCardFormProps {
  value: CreditCardData;
  onChange: (data: CreditCardData) => void;
  errors?: {
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export default function CreditCardForm({ value, onChange, errors = {} }: CreditCardFormProps) {
  const [cardType, setCardType] = useState<CardType>('unknown');
  const [isMada, setIsMada] = useState(false);
  const [touched, setTouched] = useState({
    cardNumber: false,
    cardholderName: false,
    expiryMonth: false,
    expiryYear: false,
    cvv: false,
  });

  // Detect card type and Mada when card number changes - تحديد نوع البطاقة ومدى
  useEffect(() => {
    if (value.card_number) {
      const type = detectCardType(value.card_number);
      const madaCheck = isMadaCard(value.card_number);
      setCardType(type);
      setIsMada(madaCheck);
    } else {
      setCardType('unknown');
      setIsMada(false);
    }
  }, [value.card_number]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\s/g, '');
    
    // Only allow digits and limit to 19 characters
    if (!/^\d*$/.test(input) || input.length > 19) return;
    
    onChange({
      ...value,
      card_number: input,
    });
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters and spaces
    const input = e.target.value;
    if (input && !/^[a-zA-Z\s]*$/.test(input)) return;
    
    onChange({
      ...value,
      cardholder_name: input,
    });
  };

  const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    
    // Limit to 2 digits and max value of 12
    if (input.length > 2) return;
    if (parseInt(input) > 12) return;
    
    onChange({
      ...value,
      expiry_month: input,
    });
  };

  const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    
    // Limit to 2 digits
    if (input.length > 2) return;
    
    onChange({
      ...value,
      expiry_year: input,
    });
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    
    // Limit to 3 or 4 digits (Amex uses 4)
    const maxLength = cardType === 'amex' ? 4 : 3;
    if (input.length > maxLength) return;
    
    onChange({
      ...value,
      cvv: input,
    });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Get validation status for visual feedback
  const getFieldStatus = (field: keyof typeof touched) => {
    if (!touched[field]) return '';
    
    switch (field) {
      case 'cardNumber':
        return validateCardNumber(value.card_number) ? 'valid' : 'invalid';
      case 'cardholderName':
        return validateCardholderName(value.cardholder_name) ? 'valid' : 'invalid';
      case 'expiryMonth':
      case 'expiryYear':
        return validateExpiryDate(value.expiry_month, value.expiry_year) ? 'valid' : 'invalid';
      case 'cvv':
        return validateCVV(value.cvv, cardType) ? 'valid' : 'invalid';
      default:
        return '';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6 space-y-4">
        {/* Security Badge */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Lock className="h-4 w-4 text-primary" />
          <span>جميع معلومات الدفع محمية ومشفرة بأعلى معايير الأمان</span>
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="card_number">
            رقم البطاقة <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="card_number"
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={formatCardNumber(value.card_number)}
              onChange={handleCardNumberChange}
              onBlur={() => handleBlur('cardNumber')}
              className={`pr-12 ${
                getFieldStatus('cardNumber') === 'invalid' ? 'border-destructive' : ''
              } ${
                getFieldStatus('cardNumber') === 'valid' ? 'border-primary' : ''
              }`}
              maxLength={19}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              {isMada && (
                <span className="text-xs font-bold text-primary">
                  مدى
                </span>
              )}
            </div>
          </div>
          {errors.cardNumber && touched.cardNumber && (
            <p className="text-xs text-destructive">{errors.cardNumber}</p>
          )}
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardholder_name">
            اسم حامل البطاقة <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cardholder_name"
            type="text"
            placeholder="الاسم كما هو مكتوب على البطاقة"
            value={value.cardholder_name}
            onChange={handleCardholderNameChange}
            onBlur={() => handleBlur('cardholderName')}
            className={`${
              getFieldStatus('cardholderName') === 'invalid' ? 'border-destructive' : ''
            } ${
              getFieldStatus('cardholderName') === 'valid' ? 'border-primary' : ''
            }`}
          />
          {errors.cardholderName && touched.cardholderName && (
            <p className="text-xs text-destructive">{errors.cardholderName}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="space-y-2">
            <Label>
              تاريخ الانتهاء <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="MM"
                value={value.expiry_month}
                onChange={handleExpiryMonthChange}
                onBlur={() => handleBlur('expiryMonth')}
                className={`${
                  getFieldStatus('expiryMonth') === 'invalid' ? 'border-destructive' : ''
                } ${
                  getFieldStatus('expiryMonth') === 'valid' ? 'border-primary' : ''
                }`}
                maxLength={2}
              />
              <span className="flex items-center text-muted-foreground">/</span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="YY"
                value={value.expiry_year}
                onChange={handleExpiryYearChange}
                onBlur={() => handleBlur('expiryYear')}
                className={`${
                  getFieldStatus('expiryYear') === 'invalid' ? 'border-destructive' : ''
                } ${
                  getFieldStatus('expiryYear') === 'valid' ? 'border-primary' : ''
                }`}
                maxLength={2}
              />
            </div>
            {errors.expiryDate && (touched.expiryMonth || touched.expiryYear) && (
              <p className="text-xs text-destructive">{errors.expiryDate}</p>
            )}
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <Label htmlFor="cvv">
              CVV <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cvv"
              type="text"
              inputMode="numeric"
              placeholder={cardType === 'amex' ? '1234' : '123'}
              value={value.cvv}
              onChange={handleCVVChange}
              onBlur={() => handleBlur('cvv')}
              className={`${
                getFieldStatus('cvv') === 'invalid' ? 'border-destructive' : ''
              } ${
                getFieldStatus('cvv') === 'valid' ? 'border-primary' : ''
              }`}
              maxLength={cardType === 'amex' ? 4 : 3}
            />
            {errors.cvv && touched.cvv && (
              <p className="text-xs text-destructive">{errors.cvv}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {cardType === 'amex' 
                ? 'الرقم المكون من 4 أرقام على وجه البطاقة'
                : 'الرقم المكون من 3 أرقام على ظهر البطاقة'
              }
            </p>
          </div>
        </div>

        {/* Supported Cards Info - معلومات البطاقات المدعومة */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            نقبل: <span className="font-bold text-primary">مدى</span> • Visa • Mastercard
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
