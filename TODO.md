# Quantity-Based Pricing Implementation

## Goal
Add quantity-based pricing tiers for product options, allowing admins to set different prices based on quantity ranges.

## Plan

### 1. Database Schema
- [x] Create quantity_pricing_tiers table
- [x] Add columns: id, option_value_id, min_quantity, max_quantity, price_modifier
- [x] Add migration

### 2. Types
- [x] Add QuantityPricingTier type
- [x] Add ProductOptionValueWithTiers type

### 3. API Methods
- [x] getQuantityPricingTiers()
- [x] getQuantityPricingTiersByValueId()
- [x] createQuantityPricingTier()
- [x] updateQuantityPricingTier()
- [x] deleteQuantityPricingTier()
- [x] getPriceForQuantity()

### 4. Admin UI - Product Options Page
- [x] Add "Manage Tiers" button to Values tab
- [x] Show tiers for each option value
- [x] Add tier dialog
- [x] Create tier form
- [x] Delete tier confirmation

### 5. Admin UI - Products Page
- [ ] Show quantity tiers when expanding options
- [ ] Display tier ranges and prices

### 6. Product Detail Page
- [ ] Show quantity-based pricing table
- [ ] Update price based on selected quantity
- [ ] Display tier information

### 7. Cart Calculations
- [ ] Calculate price based on quantity tier
- [ ] Update total when quantity changes

## Current Status
- ✅ Database schema complete
- ✅ API methods complete
- ✅ Admin Product Options page complete with tier management
- 🔄 Next: Update Products page to show tiers
- 🔄 Next: Update Product Detail page
- 🔄 Next: Update Cart calculations
