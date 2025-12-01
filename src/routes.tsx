import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Contact from './pages/Contact';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'الرئيسية',
    path: '/',
    element: <Home />,
  },
  {
    name: 'المنتجات',
    path: '/products',
    element: <Products />,
  },
  {
    name: 'تفاصيل المنتج',
    path: '/products/:slug',
    element: <ProductDetail />,
    visible: false,
  },
  {
    name: 'السلة',
    path: '/cart',
    element: <Cart />,
    visible: false,
  },
  {
    name: 'اتصل بنا',
    path: '/contact',
    element: <Contact />,
  },
  {
    name: 'تسجيل الدخول',
    path: '/login',
    element: <Login />,
    visible: false,
  },
];

export default routes;
