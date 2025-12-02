import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  FileText, 
  MessageSquare,
  Briefcase,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Wrench,
  Inbox,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { toast } = useToast();

  if (!user || !isAdmin) {
    navigate('/');
    return null;
  }

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Product Options', path: '/admin/product-options', icon: Settings },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Service Inquiries', path: '/admin/service-inquiries', icon: Inbox },
    { name: 'Quote Requests', path: '/admin/quote-requests', icon: DollarSign },
    { name: 'Seasonal Offers', path: '/admin/seasonal-offers', icon: Sparkles },
    { name: 'Portfolio', path: '/admin/portfolio', icon: Briefcase },
    { name: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        <aside
          className={`fixed top-0 right-0 z-40 h-screen w-64 bg-card border-l border-border transition-transform xl:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">خ</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Admin Panel</h2>
                  <p className="text-xs text-muted-foreground">khat-alailan</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{profile?.full_name || profile?.username}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/">
                  <Home className="ml-2 h-4 w-4" />
                  Back to Website
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="ml-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 xl:mr-64 pt-16 xl:pt-0">
          <div className="p-6 xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
