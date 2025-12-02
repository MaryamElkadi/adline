import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderFailed from './pages/OrderFailed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductOptions from './pages/admin/ProductOptions';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
  },
  {
    name: 'Products',
    path: '/products',
    element: <Products />,
  },
  {
    name: 'Product Detail',
    path: '/products/:slug',
    element: <ProductDetail />,
    visible: false,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <Cart />,
    visible: false,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <Checkout />,
    visible: false,
  },
  {
    name: 'Order Success',
    path: '/order-success/:orderId',
    element: <OrderSuccess />,
    visible: false,
  },
  {
    name: 'Order Failed',
    path: '/order-failed',
    element: <OrderFailed />,
    visible: false,
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <Contact />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminLayout />,
    visible: false,
    children: [
      {
        name: 'Dashboard',
        path: '',
        element: <AdminDashboard />,
      },
      {
        name: 'Products',
        path: 'products',
        element: <AdminProducts />,
      },
      {
        name: 'Product Options',
        path: 'product-options',
        element: <AdminProductOptions />,
      },
    ],
  },
];

export default routes;
