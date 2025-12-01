import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Contact from './pages/Contact';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
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
    ],
  },
];

export default routes;
