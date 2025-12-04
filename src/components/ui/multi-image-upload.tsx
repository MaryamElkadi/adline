// components/ui/multi-image-upload.tsx
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  max = 10,
  className,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max
    if (value.length + files.length > max) {
      alert(`Maximum ${max} images allowed`);
      return;
    }

    setUploading(true);
    
    const uploadedUrls: string[] = [];
    
    // Simulate multiple file uploads - replace with your actual upload logic
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Create FormData for each file
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Replace with your actual upload API call
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    if (uploadedUrls.length > 0) {
      onChange([...value, ...uploadedUrls]);
    }
    
    setUploading(false);
    // Clear the input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Current Images Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {value.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* Move buttons */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="bg-background/80 backdrop-blur-sm rounded-full p-1"
                  title="Move left"
                >
                  ←
                </button>
              )}
              {index < value.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="bg-background/80 backdrop-blur-sm rounded-full p-1"
                  title="Move right"
                >
                  →
                </button>
              )}
            </div>
            
            {/* Image number indicator */}
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Upload button */}
        {value.length < max && (
          <label className="cursor-pointer">
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex flex-col items-center justify-center transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : 'Upload'}
              </span>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </label>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        {value.length} of {max} images uploaded. Drag and drop to reorder.
      </p>
    </div>
  );
}