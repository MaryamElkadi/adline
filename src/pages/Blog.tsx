import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/db/api';
import type { BlogPost } from '@/types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await api.getPublishedBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('خطأ في تحميل المقالات:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-primary py-16 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="text-center">
            <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-4">
              المدونة
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              آخر الأخبار والمقالات والنصائح حول خدمات الطباعة
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          {loading ? (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-3" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                    <div className="h-10 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">لا توجد مقالات منشورة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-hover transition-smooth">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title_ar}
                        className="w-full h-full object-cover hover:scale-105 transition-smooth"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-3 line-clamp-2">
                      {post.title_ar}
                    </h2>

                    {post.excerpt_ar && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt_ar}
                      </p>
                    )}

                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/blog/${post.slug}`}>
                        اقرأ المزيد
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
