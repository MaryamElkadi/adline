# TODO: Enhanced Product Options & Services System

## Overview
Implement comprehensive product options system with quantity tiers, size/material/side options with price modifiers, tax calculations, and a new services section.

## Phase 1: Database Schema Updates
- [x] 1.1 Create migration for enhanced product options structure
  - [x] Add quantity_tiers table (quantity, price, product_id)
  - [x] Add product_size_options table (name, price_addition, product_id)
  - [x] Add product_material_options table (name, price_addition, product_id)
  - [x] Add product_side_options table (name, price_addition, product_id)
  - [x] Create services table (name_ar, description_ar, details, image_url, is_active)
  - [x] Create service_inquiries table (service_id, customer_name, email, phone, message)
- [x] 1.2 Update TypeScript types in @/types/index.ts
- [x] 1.3 Add API methods in @/db/api.ts

## Phase 2: Admin Product Form Enhancement
- [ ] 2.1 Add Quantity Tiers Section
  - [ ] Dynamic rows for quantity + price pairs
  - [ ] Calculate total with 15% VAT for each tier
  - [ ] Add/remove quantity tier rows
- [ ] 2.2 Add Size Options Section
  - [ ] Dynamic rows for size name + price addition
  - [ ] Add/remove size option rows
- [ ] 2.3 Add Material Options Section
  - [ ] Dynamic rows for material name + price addition
  - [ ] Add/remove material option rows
- [ ] 2.4 Add Side Options Section
  - [ ] Dynamic rows for side option + price addition
  - [ ] Add/remove side option rows
- [ ] 2.5 Add Tax Calculation Display
  - [ ] Show subtotal
  - [ ] Show 15% VAT
  - [ ] Show total price
- [ ] 2.6 Update form submission to save all options

## Phase 3: User Product Detail Page Enhancement
- [ ] 3.1 Display Quantity Tiers
  - [ ] Show all available quantity options
  - [ ] Display price for each quantity
  - [ ] Show total with tax
- [ ] 3.2 Display Size Options
  - [ ] Radio buttons or select for sizes
  - [ ] Show price addition for each size
- [ ] 3.3 Display Material Options
  - [ ] Radio buttons or select for materials
  - [ ] Show price addition for each material
- [ ] 3.4 Display Side Options
  - [ ] Radio buttons for printing sides
  - [ ] Show price addition
- [ ] 3.5 Dynamic Price Calculation
  - [ ] Calculate based on selected options
  - [ ] Show subtotal + tax + total
- [ ] 3.6 Update cart integration

## Phase 4: Services Section
- [ ] 4.1 Create Admin Services Management Page
  - [ ] List all services
  - [ ] Add/Edit/Delete services
  - [ ] Upload service images
  - [ ] Manage service details
- [ ] 4.2 Create User Services Page
  - [ ] Display all active services
  - [ ] Show service details
  - [ ] Contact/Inquiry button
- [ ] 4.3 Create Service Inquiry Form
  - [ ] Customer name, email, phone
  - [ ] Message field
  - [ ] Submit inquiry
- [ ] 4.4 Admin Service Inquiries Page
  - [ ] View all inquiries
  - [ ] Mark as contacted/resolved
  - [ ] Send response

## Phase 5: Testing & Validation
- [ ] 5.1 Test product creation with all options
- [ ] 5.2 Test product editing
- [ ] 5.3 Test user product viewing
- [ ] 5.4 Test cart with new options
- [ ] 5.5 Test services CRUD
- [ ] 5.6 Test service inquiries
- [ ] 5.7 Run linting

## Phase 6: Documentation
- [ ] 6.1 Update README with new features
- [ ] 6.2 Create user guide for product options
- [ ] 6.3 Create admin guide for services

## Notes
- Tax rate: 15% VAT
- All prices in SAR (Saudi Riyal)
- RTL layout for Arabic
- Maintain existing functionality while adding new features
