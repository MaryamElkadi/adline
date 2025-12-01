import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/db/api';
import type { BlogPost } from '@/types';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const posts = await api.getPublishedBlogPosts();
      const foundPost = posts.find(p => p.slug === slug);
      setPost(foundPost || null);
    } catch (error) {
      console.error('خطأ في تحميل المقال:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 xl:px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded" />
            <div className="aspect-video bg-muted rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 xl:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">المقال غير موجود</h1>
          <p className="text-muted-foreground mb-6">
            عذراً، لم نتمكن من العثور على المقال المطلوب
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة إلى المدونة
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 xl:px-6 py-16">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى المدونة
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">
              {post.title_ar}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </header>

          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image}
                alt={post.title_ar}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {post.excerpt_ar && (
            <div className="bg-muted/50 border-r-4 border-primary p-6 rounded-lg mb-8">
              <p className="text-lg leading-relaxed">{post.excerpt_ar}</p>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content_ar }}
            />
          </div>
        </article>

        <div className="mt-12 pt-8 border-t">
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة إلى المدونة
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
