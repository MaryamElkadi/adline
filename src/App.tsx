import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderFailed from './pages/OrderFailed';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductOptions from './pages/admin/ProductOptions';
import SimpleProductOptions from './pages/admin/SimpleProductOptions';
import EnhancedProductForm from './pages/admin/EnhancedProductForm';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminBlogPosts from './pages/admin/BlogPosts';
import AdminMessages from './pages/admin/Messages';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminServices from './pages/admin/Services';
import AdminServiceInquiries from './pages/admin/ServiceInquiries';
import AdminSeasonalOffers from './pages/admin/SeasonalOffers';

// User Layout Component
function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/order-failed" element={<OrderFailed />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin Routes - No Header/Footer */}
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<EnhancedProductForm />} />
              <Route path="products/:productId/edit" element={<EnhancedProductForm />} />
              <Route path="products/:productId/options" element={<SimpleProductOptions />} />
              <Route path="product-options" element={<AdminProductOptions />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blog" element={<AdminBlogPosts />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="service-inquiries" element={<AdminServiceInquiries />} />
              <Route path="seasonal-offers" element={<AdminSeasonalOffers />} />
            </Route>
            
            {/* User Routes - With Header/Footer */}
            <Route path="*" element={<UserLayout />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
