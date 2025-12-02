# TODO: Fixes and Seasonal Offers Implementation

## Task 1: Fix Problems
- [ ] Review and fix any console errors
- [ ] Check database connections
- [ ] Verify all routes are working
- [ ] Fix any TypeScript errors

## Task 2: Fix Cart Page Issues
- [ ] Investigate cart loading issues
- [ ] Fix cart item display
- [ ] Ensure quantity updates work correctly
- [ ] Verify price calculations
- [ ] Test checkout flow
- [ ] Add Arabic translations for cart page

## Task 3: Seasonal Offers Section (عروض موسمية)
- [ ] 3.1 Database Schema
  - [ ] Create seasonal_offers table
  - [ ] Fields: title_ar, description_ar, discount_percentage, start_date, end_date, image_url, is_active
  - [ ] Add TypeScript interfaces
  - [ ] Add API methods

- [ ] 3.2 Admin Interface
  - [ ] Create admin page at /admin/seasonal-offers
  - [ ] List all seasonal offers
  - [ ] Add/Edit/Delete offers
  - [ ] Image upload
  - [ ] Date range picker
  - [ ] Active/inactive toggle
  - [ ] Add to admin navigation

- [ ] 3.3 User Interface
  - [ ] Create seasonal offers section on home page
  - [ ] Display active offers in grid/carousel
  - [ ] Add animations (fade-in, slide-in, etc.)
  - [ ] Countdown timer for offers
  - [ ] Responsive design
  - [ ] RTL support

- [ ] 3.4 Integration
  - [ ] Add route for seasonal offers page
  - [ ] Link offers to products (optional)
  - [ ] Apply discounts to cart (optional)
