# User Guide - Profile & Account Management

## 👤 Your Profile Page

### Accessing Your Profile

1. **Make sure you're logged in**
2. **Click the user icon** in the top right corner of the header
3. **Select "Profile"** from the dropdown menu
4. Or go directly to `/profile`

---

## 📝 Profile Information Tab

### What You Can View and Edit

**Editable Fields:**
- ✏️ **Full Name**: Your display name
- ✏️ **Email**: Your email address (optional)
- ✏️ **Phone Number**: Your contact number (optional)

**Read-Only Fields:**
- 👁️ **Username**: Your unique username (cannot be changed)
- 👁️ **Role**: Your account type (User or Admin)

### How to Update Your Profile

1. Click the **"Profile Information"** tab
2. Edit any of the editable fields
3. Click **"Save Changes"** button
4. You'll see a success message when saved

**Tips:**
- ✅ Email and phone are optional but recommended
- ✅ Changes are saved immediately to the database
- ✅ You'll receive a confirmation notification

---

## 🔒 Security Tab

### Changing Your Password

1. Click the **"Security"** tab
2. Fill in the form:
   - **New Password**: Your new password (minimum 6 characters)
   - **Confirm Password**: Type the same password again
3. Click **"Change Password"** button

### Password Requirements

Your new password must:
- ✅ Be at least 6 characters long
- ✅ Match in both fields (New Password and Confirm Password)

**Security Tips:**
- 🔐 Use a strong, unique password
- 🔐 Don't share your password with anyone
- 🔐 Change your password regularly
- 🔐 Use a mix of letters, numbers, and symbols

---

## 🎨 Registration & Login

### Creating a New Account

**Option 1: Traditional Sign Up**

1. Go to `/login`
2. Click the **"Sign Up"** tab
3. Fill in the registration form:
   - **Full Name** (optional): Your display name
   - **Username** (required): Choose a unique username
   - **Email** (optional): Your email address
   - **Phone Number** (optional): Your contact number
   - **Password** (required): At least 6 characters
   - **Confirm Password** (required): Must match password
4. Click **"Create Account"**
5. You'll be logged in automatically

**Option 2: Sign Up with Google**

1. Go to `/login`
2. Click the **"Sign Up"** tab
3. Click **"Sign up with Google"** button
4. Authorize with your Google account
5. Your account is created automatically
6. You'll be redirected to the home page

**Option 3: Sign Up with Facebook**

1. Go to `/login`
2. Click the **"Sign Up"** tab
3. Click **"Sign up with Facebook"** button
4. Authorize with your Facebook account
5. Your account is created automatically
6. You'll be redirected to the home page

### Logging In

**Option 1: Username & Password**

1. Go to `/login`
2. Make sure you're on the **"Sign In"** tab
3. Enter your **Username**
4. Enter your **Password**
5. Click **"Sign In"**

**Option 2: Sign In with Google**

1. Go to `/login`
2. Click **"Sign in with Google"** button
3. Select your Google account
4. You'll be logged in automatically

**Option 3: Sign In with Facebook**

1. Go to `/login`
2. Click **"Sign in with Facebook"** button
3. Authorize with Facebook
4. You'll be logged in automatically

---

## 🛒 Shopping Experience

### Browsing Products

1. **Browse Categories**: Click on any category to see products
2. **View Product Details**: Click on a product card
3. **Select Options**: Choose size, material, design service, etc.
4. **See Price Updates**: Price changes based on your selections
5. **Add to Cart**: Click "Add to Cart" button

### Product Options Explained

When viewing a product, you may see various options:

**Required Options** (marked with *)
- You MUST select these before adding to cart
- Examples: Size, Material, Quantity

**Optional Options**
- You CAN select these if you want
- Examples: Design Service, Express Delivery

**Price Modifiers**
- Some options add to the price (shown in green with +)
- Some options reduce the price (shown in red with -)
- Some options don't change the price

**Example:**
```
Base Price: 100 SAR

Options:
- Size: Large (+50 SAR)
- Material: Premium Glossy (+30 SAR)
- Design: Basic Design Service (+100 SAR)

Total: 280 SAR
```

### Cart & Checkout

1. **View Cart**: Click cart icon in header
2. **Review Items**: See all products and selected options
3. **Update Quantity**: Change quantities if needed
4. **Remove Items**: Click remove button if needed
5. **Proceed to Checkout**: Click "Proceed to Checkout"
6. **Fill Shipping Info**: Enter delivery address
7. **Select Payment**: Choose payment method
8. **Place Order**: Click "Place Order"
9. **Order Confirmation**: You'll see success page with order number

---

## 🎯 Account Features

### For Regular Users

- ✅ Browse all products
- ✅ View product details and options
- ✅ Add items to cart
- ✅ Complete checkout
- ✅ View order history
- ✅ Update profile information
- ✅ Change password
- ✅ Contact support

### For Admin Users

All user features PLUS:
- ✅ Access admin dashboard
- ✅ Manage products
- ✅ Manage categories
- ✅ Manage product options
- ✅ View all orders
- ✅ Manage users
- ✅ View messages
- ✅ Manage blog posts
- ✅ Manage portfolio

---

## 💡 Tips & Best Practices

### Profile Management

**Keep Your Information Updated:**
- ✅ Add your email for order confirmations
- ✅ Add your phone for delivery updates
- ✅ Use your real name for easier communication

**Security:**
- 🔐 Use a strong password
- 🔐 Don't share your account
- 🔐 Log out on shared devices
- 🔐 Change password if compromised

### Shopping Tips

**Before Ordering:**
- ✅ Review all product options carefully
- ✅ Check the final price before adding to cart
- ✅ Read product descriptions
- ✅ Check delivery times

**During Checkout:**
- ✅ Double-check shipping address
- ✅ Verify phone number for delivery
- ✅ Add any special instructions in notes
- ✅ Review order summary before placing order

**After Ordering:**
- ✅ Save your order number
- ✅ Check your email for confirmation
- ✅ Track your order status
- ✅ Contact support if needed

---

## 🔍 Troubleshooting

### Can't Log In

**Problem**: "Invalid credentials" error

**Solutions:**
- ✅ Check username spelling (case-sensitive)
- ✅ Verify password is correct
- ✅ Try "Forgot Password" if available
- ✅ Try signing in with Google/Facebook if you registered that way

### Can't Update Profile

**Problem**: Changes not saving

**Solutions:**
- ✅ Make sure you clicked "Save Changes"
- ✅ Check for error messages
- ✅ Refresh the page and try again
- ✅ Clear browser cache

### Can't Change Password

**Problem**: Password change fails

**Solutions:**
- ✅ Make sure new password is at least 6 characters
- ✅ Verify both password fields match
- ✅ Check for error messages
- ✅ Try logging out and back in

### Options Not Showing

**Problem**: Can't see product options

**Solutions:**
- ✅ Refresh the page
- ✅ Clear browser cache
- ✅ Try a different browser
- ✅ Contact support if issue persists

### Price Not Updating

**Problem**: Price doesn't change when selecting options

**Solutions:**
- ✅ Refresh the page
- ✅ Clear browser cache
- ✅ Make sure JavaScript is enabled
- ✅ Try a different browser

---

## 📱 Mobile Experience

### Using on Mobile Devices

The website is fully responsive and works great on mobile:

**Profile Page:**
- ✅ Tabs stack vertically on small screens
- ✅ Forms are touch-friendly
- ✅ All features work the same

**Shopping:**
- ✅ Easy product browsing
- ✅ Touch-friendly option selection
- ✅ Mobile-optimized checkout
- ✅ Responsive cart view

**Tips for Mobile:**
- ✅ Use portrait mode for best experience
- ✅ Zoom in if text is too small
- ✅ Use the mobile menu (hamburger icon)

---

## 🌐 Language Support

### Current Language

The interface is currently in **English**.

**Arabic Support:**
- ✅ Product names available in Arabic
- ✅ Option names available in Arabic
- ✅ Category names available in Arabic
- ✅ RTL layout support

---

## 📞 Getting Help

### Contact Support

If you need assistance:

1. **Contact Page**: Go to `/contact`
2. **WhatsApp**: Click WhatsApp button (if available)
3. **Email**: Send email through contact form
4. **Facebook**: Message on Facebook page

### Common Questions

**Q: How do I track my order?**
A: Go to your profile and check order history (feature may vary)

**Q: Can I cancel an order?**
A: Contact support immediately with your order number

**Q: How long does delivery take?**
A: Check the delivery information page or product details

**Q: Can I change my username?**
A: No, usernames cannot be changed after registration

**Q: What if I forgot my password?**
A: Use the "Forgot Password" feature or contact support

**Q: Can I have multiple accounts?**
A: It's recommended to use only one account per person

---

## ✅ Quick Checklist

### New User Setup

- [ ] Create account (traditional or social)
- [ ] Log in successfully
- [ ] Go to profile page
- [ ] Add full name
- [ ] Add email address
- [ ] Add phone number
- [ ] Save changes
- [ ] Browse products
- [ ] Test adding to cart

### Before First Order

- [ ] Profile information is complete
- [ ] Email is verified (if required)
- [ ] Phone number is correct
- [ ] Understand product options
- [ ] Know how to select options
- [ ] Understand price modifiers
- [ ] Know how to checkout

### Regular Maintenance

- [ ] Keep profile information updated
- [ ] Change password periodically
- [ ] Review order history
- [ ] Update contact information if changed
- [ ] Log out on shared devices

---

## 🎉 Welcome!

Thank you for using khat-alailan printing services!

We hope this guide helps you:
- ✅ Manage your profile easily
- ✅ Shop with confidence
- ✅ Understand product options
- ✅ Complete orders successfully
- ✅ Get the best printing services

**Happy Printing! 🖨️**

---

## 📚 Additional Resources

- **Admin Guide**: See ADMIN_GUIDE.md (for admins only)
- **Implementation Summary**: See FINAL_IMPLEMENTATION_SUMMARY.md
- **Technical Documentation**: See other .md files in root directory

---

**Last Updated**: December 2024
**Version**: 1.0
**Support**: Contact through website contact form
