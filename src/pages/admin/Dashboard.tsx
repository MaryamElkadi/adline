import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, ShoppingCart, Users, FileText, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/db/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    blogPosts: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, categories, orders, users, blogPosts, messages] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getAllProfiles(),
        api.getBlogPosts(),
        api.getContactMessages(),
      ]);

      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        users: users.length,
        blogPosts: blogPosts.length,
        messages: messages.filter(m => !m.is_read).length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      link: '/admin/products',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: FolderTree,
      link: '/admin/categories',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      link: '/admin/orders',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Users',
      value: stats.users,
      icon: Users,
      link: '/admin/users',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      link: '/admin/blog',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Unread Messages',
      value: stats.messages,
      icon: MessageSquare,
      link: '/admin/messages',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to khat-alailan admin panel</p>
      </div>

      <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-hover transition-smooth cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-8 bg-muted rounded animate-pulse" />
                  ) : (
                    <div className="text-3xl font-bold">{stat.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/admin/products"
              className="block p-3 rounded-lg hover:bg-muted transition-smooth"
            >
              <p className="font-medium">Manage Products</p>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
            </Link>
            <Link
              to="/admin/orders"
              className="block p-3 rounded-lg hover:bg-muted transition-smooth"
            >
              <p className="font-medium">View Orders</p>
              <p className="text-sm text-muted-foreground">Process and manage customer orders</p>
            </Link>
            <Link
              to="/admin/categories"
              className="block p-3 rounded-lg hover:bg-muted transition-smooth"
            >
              <p className="font-medium">Manage Categories</p>
              <p className="text-sm text-muted-foreground">Organize product categories</p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Authentication</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm font-medium text-green-600">Available</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
