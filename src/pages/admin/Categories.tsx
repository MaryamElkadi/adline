import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

// Drag and Drop Image Upload Component
interface DragDropImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
}

function DragDropImageUpload({
  value,
  onChange,
  onRemove,
  className,
}: DragDropImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create object URL for preview (in real app, upload to server)
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
      
      // In a real app, you would upload to your server here
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // onChange(data.url);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div className={cn('space-y-3', className)}>
      {value ? (
        <div className="relative">
          <div className="aspect-square max-w-xs rounded-lg overflow-hidden border-2 border-primary">
            <img
              src={value}
              alt="Category image"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer block">
          <div
            className={cn(
              'aspect-square max-w-xs rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
              uploading && 'opacity-50 cursor-not-allowed'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-2"></div>
                <span className="text-sm text-muted-foreground">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Drag & drop image here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 800x800px
                  </p>
                </div>
              </>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </label>
      )}
      
      {!value && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Drag and drop an image file here</p>
          <p>• Or click to select from your computer</p>
          <p>• Supports JPG, PNG, WebP formats</p>
        </div>
      )}
    </div>
  );
}

// Icon selector component
const ICONS = [
  '📦', '🎨', '🖼️', '📝', '✏️', '🎯', '⭐', '🔥', '💎', '✨',
  '📱', '💻', '🖥️', '⌨️', '🖱️', '📷', '🎥', '🎮', '🎧', '📚',
  '🎁', '🎀', '🎈', '🛍️', '💰', '💳', '📊', '📈', '📉', '🔧',
  '🔨', '⚡', '💡', '🔋', '📡', '🌐', '🔗', '📎', '📌', '📍',
  '🏷️', '🏆', '🎖️', '🥇', '🥈', '🥉', '🏅', '🎪', '🎭', '🎨',
  '🖌️', '🎭', '🎤', '🎸', '🥁', '🎹', '🎺', '🎻', '🎼', '🎵',
  '🎶', '🩰', '🎬', '🎞️', '📽️', '🎫', '🏛️', '🏟️', '🏰', '🏯',
  '🗼', '🗽', '🌍', '🌎', '🌏', '🗺️', '🏔️', '⛰️', '🌋', '🏕️',
  '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️',
  '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪'
];

function IconSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Select or type an emoji"
          className="flex-1"
        />
        {value && (
          <div className="text-2xl">{value}</div>
        )}
      </div>
      <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg">
        {ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-xl',
              value === icon && 'bg-primary text-primary-foreground'
            )}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_ar: '',
    slug: '',
    description_ar: '',
    icon: '',
    image_url: '',
    parent_id: null as string | null,
    display_order: 0,
    is_active: true,
  });

  const [parentCategories, setParentCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
      // Filter active categories for parent selection
      setParentCategories(data.filter(c => c.is_active));
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name_ar: category.name_ar,
        slug: category.slug,
        description_ar: category.description_ar || '',
        icon: category.icon || '',
        image_url: category.image_url || '',
        parent_id: category.parent_id,
        display_order: category.display_order,
        is_active: category.is_active,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name_ar: '',
        slug: '',
        description_ar: '',
        icon: '',
        image_url: '',
        parent_id: null,
        display_order: 0,
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name_ar.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'Error',
        description: 'Slug is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await api.createCategory(formData);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      setDialogOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await api.deleteCategory(deletingCategory.id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description_ar?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="ml-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell>
                        {category.icon ? (
                          <span className="text-2xl">{category.icon}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-medium">{category.name_ar}</span>
                          {category.description_ar && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {category.description_ar}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        {category.image_url ? (
                          <div className="w-10 h-10 rounded overflow-hidden border">
                            <img
                              src={category.image_url}
                              alt={category.name_ar}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded border border-dashed flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {category.display_order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(category)}
                            title="Edit category"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingCategory(category);
                              setDeleteDialogOpen(true);
                            }}
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category information' : 'Create a new category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Category Image - Drag & Drop */}
            <div className="space-y-3">
              <Label>Category Image</Label>
              <DragDropImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onRemove={() => setFormData({ ...formData, image_url: '' })}
              />
              <p className="text-xs text-muted-foreground">
                Upload an image for this category. It will be displayed in category listings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Label htmlFor="name_ar">
                    Category Name (Arabic) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="اسم الفئة"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="category-name"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs. Use lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent Category (Optional)</Label>
                  <select
                    id="parent_id"
                    value={formData.parent_id || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      parent_id: e.target.value || null 
                    })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">No parent (Main Category)</option>
                    {parentCategories
                      .filter(c => !editingCategory || c.id !== editingCategory.id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_ar}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Categories are sorted by this number (lower numbers first)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Icon Selection */}
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <IconSelector
                    value={formData.icon}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Select an emoji to represent this category
                  </p>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active" className="font-medium">
                      Category Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_active ? 'Active and visible' : 'Hidden from users'}
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description_ar">Description (Arabic)</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                placeholder="أدخل وصفاً للفئة..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Describe what products or services are in this category
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{deletingCategory?.name_ar}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}