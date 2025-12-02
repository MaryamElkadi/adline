# Seasonal Offers Implementation Guide (عروض موسمية)

## Overview
This document describes the complete implementation of the Seasonal Offers feature, including database schema, API methods, admin interface, and user-facing components with animations.

## Database Schema

### Table: `seasonal_offers`

```sql
CREATE TABLE seasonal_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  description_ar text NOT NULL,
  discount_percentage integer CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  image_url text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Constraints:**
- `discount_percentage` must be between 0 and 100
- `end_date` must be after `start_date`

**Indexes:**
- `idx_seasonal_offers_active` on `is_active`
- `idx_seasonal_offers_dates` on `start_date, end_date`

## API Methods

Located in: `src/db/api.ts`

### 1. `getSeasonalOffers()`
Returns all seasonal offers ordered by creation date (newest first).

### 2. `getActiveSeasonalOffers()`
Returns only active offers that are currently valid (within date range and is_active = true).

### 3. `getSeasonalOfferById(id: string)`
Returns a single offer by ID.

### 4. `createSeasonalOffer(offer: {...})`
Creates a new seasonal offer.

**Parameters:**
- `title_ar` (required): Offer title in Arabic
- `description_ar` (required): Offer description in Arabic
- `discount_percentage` (optional): Discount percentage (0-100)
- `start_date` (required): Start date (ISO string)
- `end_date` (required): End date (ISO string)
- `image_url` (optional): URL to offer image
- `is_active` (optional): Active status (default: true)

### 5. `updateSeasonalOffer(id: string, updates: {...})`
Updates an existing seasonal offer.

### 6. `deleteSeasonalOffer(id: string)`
Deletes a seasonal offer.

## Admin Interface

### Location
`src/pages/admin/SeasonalOffers.tsx`

### Route
`/admin/seasonal-offers`

### Features
1. **List View**
   - Displays all offers in a responsive grid
   - Shows status badges (active/pending/inactive)
   - Displays discount percentage if available
   - Shows start and end dates
   - Preview of offer image

2. **Create/Edit Dialog**
   - Form fields:
     - Title (Arabic)
     - Description (Arabic, textarea)
     - Discount percentage (0-100)
     - Image URL
     - Start date (date picker)
     - End date (date picker)
     - Active toggle switch
   - Validation for required fields
   - Date range validation

3. **Delete Functionality**
   - Confirmation dialog before deletion
   - Toast notifications for success/error

### Status Logic
- **Active (نشط)**: `is_active = true` AND current date is between start_date and end_date
- **Pending (معلق)**: `is_active = true` BUT current date is outside date range
- **Inactive (غير نشط)**: `is_active = false`

## User Interface

### Component
`src/components/SeasonalOffersSection.tsx`

### Integration
Added to Home page (`src/pages/Home.tsx`) after the hero section.

### Features

1. **Responsive Grid Layout**
   - 1 column on mobile
   - 2 columns on medium screens
   - 3 columns on large screens (xl breakpoint)

2. **Offer Card Components**
   - Large image with hover zoom effect
   - Discount badge (top-right corner with pulse animation)
   - Offer title and description
   - Date range display
   - Countdown timer

3. **Countdown Timer**
   - Shows days, hours, and minutes remaining
   - Updates in real-time
   - Styled with primary color theme
   - Grid layout for time units

4. **Visual Effects**
   - Gradient background
   - Border hover effects
   - Shadow transitions
   - Active status badge

## Animations

### CSS Animations (in `src/index.css`)

1. **fade-in**
   - Duration: 0.8s
   - Effect: Fades in from opacity 0 with slight upward movement
   - Used for: Section header

2. **slide-up**
   - Duration: 0.6s
   - Effect: Slides up from 40px below with fade-in
   - Used for: Offer cards with staggered delays (150ms per card)

3. **pulse-slow**
   - Duration: 3s (infinite)
   - Effect: Gentle scale and opacity pulse
   - Used for: Discount percentage badge

4. **Hover Effects**
   - Image scale: 1.1x on hover (700ms transition)
   - Card shadow: Enhanced on hover
   - Border color: Changes to primary/50 on hover
   - Title color: Changes to primary on hover

## RTL Support

All components fully support RTL (Right-to-Left) layout:
- `dir="rtl"` attribute on main containers
- Proper text alignment
- Icon positioning adjusted for RTL
- Flexbox and grid layouts work correctly in RTL

## Usage Instructions

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin/seasonal-offers`
   - Click "إضافة عرض جديد" (Add New Offer)

2. **Create an Offer**
   - Fill in the Arabic title and description
   - Add discount percentage (optional)
   - Provide an image URL
   - Select start and end dates
   - Toggle active status
   - Click "إضافة" (Add)

3. **Edit an Offer**
   - Click the edit icon on any offer card
   - Modify the fields as needed
   - Click "تحديث" (Update)

4. **Delete an Offer**
   - Click the trash icon on any offer card
   - Confirm deletion in the dialog

### For Users

- Active seasonal offers automatically appear on the home page
- Offers are displayed in a visually appealing grid with animations
- Countdown timers show how much time is left for each offer
- Only offers that are active and within their date range are shown

## Technical Notes

1. **Date Handling**
   - All dates are stored in UTC (timestamptz)
   - Dates are compared using ISO strings
   - Local date formatting uses 'ar-SA' locale

2. **Performance**
   - Offers are fetched once on component mount
   - Active offers are filtered server-side for efficiency
   - Images are lazy-loaded

3. **Error Handling**
   - Toast notifications for all operations
   - Graceful fallback if no offers are available
   - Console error logging for debugging

4. **Accessibility**
   - Semantic HTML structure
   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader friendly

## Future Enhancements (Optional)

1. Link offers to specific products or categories
2. Apply automatic discounts to cart items
3. Email notifications for new offers
4. Analytics tracking for offer views/clicks
5. Multiple image support (carousel)
6. Rich text editor for descriptions
7. Offer templates for quick creation
8. Bulk operations (activate/deactivate multiple offers)

## Files Modified/Created

### Created
- `supabase/migrations/20240116_seasonal_offers.sql`
- `src/pages/admin/SeasonalOffers.tsx`
- `src/components/SeasonalOffersSection.tsx`
- `SEASONAL_OFFERS_IMPLEMENTATION.md`

### Modified
- `src/types/index.ts` - Added SeasonalOffer interface
- `src/db/api.ts` - Added 7 API methods
- `src/routes.tsx` - Added admin route
- `src/pages/admin/AdminLayout.tsx` - Added navigation item
- `src/pages/Home.tsx` - Integrated component
- `src/index.css` - Added animations

## Testing Checklist

- [x] Database migration runs successfully
- [x] API methods return correct data
- [x] Admin can create offers
- [x] Admin can edit offers
- [x] Admin can delete offers
- [x] Active offers appear on home page
- [x] Inactive offers don't appear on home page
- [x] Countdown timer updates correctly
- [x] Animations work smoothly
- [x] Responsive design works on all screen sizes
- [x] RTL layout displays correctly
- [x] All linting passes
- [x] No TypeScript errors

## Support

For questions or issues related to the Seasonal Offers feature, please refer to:
- Database schema: `supabase/migrations/20240116_seasonal_offers.sql`
- API documentation: `src/db/api.ts` (lines 1390-1481)
- Admin interface: `src/pages/admin/SeasonalOffers.tsx`
- User interface: `src/components/SeasonalOffersSection.tsx`
