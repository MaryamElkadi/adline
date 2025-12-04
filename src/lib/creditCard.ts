import type { CardType } from '@/types';

/**
 * Mada Card Utility Functions - مكتبة التحقق من بطاقات مدى
 * Provides validation, formatting, and Mada card detection
 */

// Mada BIN ranges (Bank Identification Numbers) - أرقام تعريف بنوك مدى
const MADA_BINS = [
  '446404', '440647', '440795', '446393', '409201', '458456', '484783', '462220',
  '455708', '410621', '455036', '968208', '457865', '484308', '968209', '462564',
  '455708', '588848', '455708', '968205', '588850', '968203', '446672', '543357',
  '434107', '407197', '407395', '446393', '636120', '968211', '446404', '446672',
  '509734', '509735', '588848', '588850', '588982', '589005', '968201', '446393',
  '588982', '589005', '508160', '531095', '530906', '532013', '605141', '968205',
  '446404', '446672', '509734', '588848', '588850', '968208', '968209', '968210',
];

// Card number patterns for different card types - أنماط أرقام البطاقات
const CARD_PATTERNS: Record<CardType, RegExp> = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  unknown: /^[0-9]+$/,
};

/**
 * Check if card is a Mada card - التحقق من بطاقة مدى
 */
export function isMadaCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Check if card number starts with any Mada BIN
  return MADA_BINS.some(bin => cleaned.startsWith(bin));
}

/**
 * Detect card type from card number - تحديد نوع البطاقة
 */
export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Check for Mada first (priority for Saudi market)
  if (isMadaCard(cleaned)) return 'visa'; // Mada cards are co-branded with Visa/Mastercard
  
  if (CARD_PATTERNS.visa.test(cleaned)) return 'visa';
  if (CARD_PATTERNS.mastercard.test(cleaned)) return 'mastercard';
  if (CARD_PATTERNS.amex.test(cleaned)) return 'amex';
  if (CARD_PATTERNS.discover.test(cleaned)) return 'discover';
  
  return 'unknown';
}

/**
 * Format card number with spaces (4 digits per group)
 * Example: 4111111111111111 -> 4111 1111 1111 1111
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '');
  const cardType = detectCardType(cleaned);
  
  // Amex uses 4-6-5 format
  if (cardType === 'amex') {
    return cleaned
      .replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
      .trim();
  }
  
  // Other cards use 4-4-4-4 format
  return cleaned
    .replace(/(\d{4})/g, '$1 ')
    .trim();
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Validate expiry date
 */
export function validateExpiryDate(month: string, year: string): boolean {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Check valid month
  if (monthNum < 1 || monthNum > 12) return false;
  
  // Check valid year format (2 or 4 digits)
  if (year.length !== 2 && year.length !== 4) return false;
  
  // Convert 2-digit year to 4-digit
  const fullYear = year.length === 2 ? 2000 + yearNum : yearNum;
  
  // Check if card is expired
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (fullYear < currentYear) return false;
  if (fullYear === currentYear && monthNum < currentMonth) return false;
  
  return true;
}

/**
 * Validate CVV
 */
export function validateCVV(cvv: string, cardType: CardType): boolean {
  // Amex uses 4 digits, others use 3
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  return /^\d+$/.test(cvv) && cvv.length === expectedLength;
}

/**
 * Mask card number (show only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const lastFour = cleaned.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
}

/**
 * Get last 4 digits of card number
 */
export function getLastFourDigits(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.slice(-4);
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(month: string, year: string): string {
  const paddedMonth = month.padStart(2, '0');
  const shortYear = year.length === 4 ? year.slice(-2) : year;
  return `${paddedMonth}/${shortYear}`;
}

/**
 * Get card type display name
 */
export function getCardTypeName(cardType: CardType): string {
  const names: Record<CardType, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    unknown: 'Unknown',
  };
  
  return names[cardType];
}

/**
 * Validate cardholder name
 */
export function validateCardholderName(name: string): boolean {
  // Must be at least 2 characters and contain only letters and spaces
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

/**
 * Complete card validation
 */
export interface CardValidationResult {
  isValid: boolean;
  errors: {
    cardNumber?: string;
    cardholderName?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export function validateCreditCard(
  cardNumber: string,
  cardholderName: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
): CardValidationResult {
  const errors: CardValidationResult['errors'] = {};
  
  // Validate card number
  if (!validateCardNumber(cardNumber)) {
    errors.cardNumber = 'رقم البطاقة غير صحيح';
  }
  
  // Validate cardholder name
  if (!validateCardholderName(cardholderName)) {
    errors.cardholderName = 'اسم حامل البطاقة غير صحيح';
  }
  
  // Validate expiry date
  if (!validateExpiryDate(expiryMonth, expiryYear)) {
    errors.expiryDate = 'تاريخ انتهاء الصلاحية غير صحيح أو منتهي';
  }
  
  // Validate CVV
  const cardType = detectCardType(cardNumber);
  if (!validateCVV(cvv, cardType)) {
    errors.cvv = cardType === 'amex' ? 'رمز الأمان يجب أن يكون 4 أرقام' : 'رمز الأمان يجب أن يكون 3 أرقام';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
