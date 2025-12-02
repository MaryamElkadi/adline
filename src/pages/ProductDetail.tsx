import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ProductWithOptions, SimpleProductOptionWithTiers } from '@/types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [productOptions, setProductOptions] = useState<SimpleProductOptionWithTiers[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state - store selected option IDs
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [wantSample, setWantSample] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  // Recalculate price when options or quantity change
  useEffect(() => {
    const updatePrice = async () => {
      const price = await calculateTotalPrice();
      setTotalPrice(price);
    };
    updatePrice();
  }, [selectedOptions, quantity, product, productOptions]);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const data = await api.getProductBySlug(slug);
      if (data) {
        setProduct(data);
        
        // Load simplified product options with tiers
        const options = await api.getSimpleProductOptionsWithTiers(data.id);
        setProductOptions(options);
      } else {
        toast({
          title: 'Product Not Found',
          description: 'The requested product could not be found',
          variant: 'destructive',
        });
        navigate('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOptions(prev => {
      // Group options by name - only one value per option name
      const option = productOptions.find(o => o.id === optionId);
      if (!option) return prev;
      
      // Remove any previously selected option with the same name
      const newOptions: Record<string, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const existingOption = productOptions.find(o => o.id === key);
        if (existingOption && existingOption.option_name_en !== option.option_name_en) {
          newOptions[key] = value;
        }
      });
      
      // Add the new selection
      newOptions[optionId] = optionId;
      return newOptions;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image (JPG, PNG) or PDF file only',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive',
      });
      return;
    }

    setDesignFile(file);
  };

  const calculateTotalPrice = async (): Promise<number> => {
    if (!product) return 0;

    let total = product.base_price;

    // Add price modifiers from selected options with quantity tiers
    for (const optionId of Object.keys(selectedOptions)) {
      const option = productOptions.find(o => o.id === optionId);
      if (option) {
        // Check if there are quantity tiers
        if (option.quantity_tiers && option.quantity_tiers.length > 0) {
          // Find the appropriate tier for the current quantity
          const tier = option.quantity_tiers.find(t => 
            t.min_quantity <= quantity && 
            (t.max_quantity === null || t.max_quantity >= quantity)
          );
          
          if (tier) {
            total += tier.price_modifier;
          } else {
            // No tier found, use base price modifier
            total += option.price_modifier;
          }
        } else {
          // No tiers, use base price modifier
          total += option.price_modifier;
        }
      }
    }

    return total;
  };

  const getPriceModifiers = (): Record<string, number> => {
    const modifiers: Record<string, number> = {};

    Object.keys(selectedOptions).forEach(optionId => {
      const option = productOptions.find(o => o.id === optionId);
      if (option) {
        // Check for quantity tiers
        if (option.quantity_tiers && option.quantity_tiers.length > 0) {
          const tier = option.quantity_tiers.find(t => 
            t.min_quantity <= quantity && 
            (t.max_quantity === null || t.max_quantity >= quantity)
          );
          
          if (tier && tier.price_modifier !== 0) {
            modifiers[option.option_name_en || option.option_name_ar] = tier.price_modifier;
          } else if (option.price_modifier !== 0) {
            modifiers[option.option_name_en || option.option_name_ar] = option.price_modifier;
          }
        } else if (option.price_modifier !== 0) {
          modifiers[option.option_name_en || option.option_name_ar] = option.price_modifier;
        }
      }
    });

    return modifiers;
  };

  const validateForm = (): string | null => {
    // If no options are configured, validation passes
    if (productOptions.length === 0) {
      return null;
    }

    // Get unique option names
    const optionNames = new Set(productOptions.map(o => o.option_name_en || o.option_name_ar));
    
    // Check if at least one option from each group is selected
    for (const optionName of optionNames) {
      const optionsInGroup = productOptions.filter(o => 
        (o.option_name_en || o.option_name_ar) === optionName
      );
      
      const hasSelection = optionsInGroup.some(o => selectedOptions[o.id]);
      
      if (!hasSelection && optionsInGroup.length > 0) {
        return `Please select ${optionName}`;
      }
    }

    return null;
  };

  const handleAddToCart = async () => {
    if (!product) return;

    console.log('Add to cart clicked');
    console.log('Product options:', productOptions);
    console.log('Selected options:', selectedOptions);
    console.log('Quantity:', quantity);

    const validationError = validateForm();
    if (validationError) {
      console.log('Validation error:', validationError);
      toast({
        title: 'Please Complete All Fields',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Build custom options object with selected option details
      const customOptions: Record<string, any> = {
        priceModifiers: getPriceModifiers(),
        quantity,
      };

      // Add selected option details
      Object.keys(selectedOptions).forEach(optionId => {
        const option = productOptions.find(o => o.id === optionId);
        if (option) {
          const optionKey = option.option_name_en || option.option_name_ar;
          customOptions[optionKey] = {
            optionId: option.id,
            value: option.option_value_en || option.option_value_ar,
            priceModifier: option.price_modifier,
          };
        }
      });

      if (designFile) {
        customOptions.designFileName = designFile.name;
      }

      if (wantSample) {
        customOptions.wantSample = wantSample;
      }

      console.log('Adding to cart with options:', customOptions);

      await addItem(product.id, quantity, customOptions);

      toast({
        title: 'Added to Cart',
        description: 'Product added to cart successfully',
      });

      // Reset form
      setSelectedOptions({});
      setQuantity(1);
      setDesignFile(null);
      setWantSample('');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add product to cart',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="animate-pulse">
              <div className="aspect-square bg-muted" />
            </Card>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded w-2/3 animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted">
                <img
                  src={product.image_url || 'https://via.placeholder.com/600'}
                  alt={product.name_ar}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-smooth">
                    <div className="aspect-square bg-muted">
                      <img
                        src={image}
                        alt={`${product.name_ar} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Options Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">{product.name_ar}</h1>
                  {product.category && (
                    <p className="text-muted-foreground text-sm">
                      {product.category.name_ar}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">رقم الموديل:</span>
                    <span className="font-medium">{product.id.slice(0, 8)}</span>
                  </div>
                </div>

                <Tabs defaultValue="options" className="mb-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="options" className="flex-1">خيارات المنتج</TabsTrigger>
                    <TabsTrigger value="description" className="flex-1">تفاصيل المنتج</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="options" className="space-y-4 mt-6">
                    {/* Quantity Input */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-base">
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-32"
                      />
                    </div>

                    {/* Dynamic Options from Database - Grouped by Option Name */}
                    {productOptions.length === 0 ? (
                      <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                        <p>No product options configured. You can still add this product to cart.</p>
                      </div>
                    ) : (
                      (() => {
                        // Group options by name
                        const optionGroups = new Map<string, SimpleProductOptionWithTiers[]>();
                        productOptions.forEach(option => {
                          const key = option.option_name_en || option.option_name_ar;
                          if (!optionGroups.has(key)) {
                            optionGroups.set(key, []);
                          }
                          optionGroups.get(key)!.push(option);
                        });

                        return Array.from(optionGroups.entries()).map(([optionName, options]) => (
                          <div key={optionName} className="space-y-2">
                            <Label className="text-base">
                              {optionName} <span className="text-destructive">*</span>
                            </Label>
                            <RadioGroup
                              value={Object.keys(selectedOptions).find(id => 
                                options.some(o => o.id === id)
                              ) || ''}
                              onValueChange={(value) => handleOptionChange(value)}
                            >
                              <div className="grid grid-cols-1 gap-2">
                                {options.filter(o => o.is_available).map((option) => {
                                  // Calculate price for this option based on quantity
                                  let displayPrice = option.price_modifier;
                                  if (option.quantity_tiers && option.quantity_tiers.length > 0) {
                                    const tier = option.quantity_tiers.find(t => 
                                      t.min_quantity <= quantity && 
                                      (t.max_quantity === null || t.max_quantity >= quantity)
                                    );
                                    if (tier) {
                                      displayPrice = tier.price_modifier;
                                    }
                                  }

                                  return (
                                    <div key={option.id} className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                                      <RadioGroupItem value={option.id} id={option.id} />
                                      <Label htmlFor={option.id} className="flex-1 cursor-pointer flex items-center justify-between">
                                        <span>{option.option_value_en || option.option_value_ar}</span>
                                        {displayPrice !== 0 && (
                                          <span className="text-sm font-medium text-primary">
                                            {displayPrice > 0 ? '+' : ''}
                                            {displayPrice.toFixed(2)} SAR
                                          </span>
                                        )}
                                      </Label>
                                    </div>
                                  );
                                })}
                              </div>
                            </RadioGroup>
                            
                            {/* Show quantity tier info if available */}
                            {options.some(o => o.quantity_tiers && o.quantity_tiers.length > 0) && (
                              <p className="text-xs text-muted-foreground mt-2">
                                💡 Prices vary based on quantity. Adjust quantity to see different pricing tiers.
                              </p>
                            )}
                          </div>
                        ));
                      })()
                    )}

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="designFile" className="text-base">
                        Upload Design File (Optional)
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="designFile"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('designFile')?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {designFile ? designFile.name : 'Choose File'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Max: 10MB (JPG, PNG, PDF)
                      </p>
                    </div>

                    {/* Sample Request */}
                    <div className="space-y-2">
                      <Label className="text-base">
                        Do you want a sample before production?
                      </Label>
                      <RadioGroup value={wantSample} onValueChange={setWantSample}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="yes" id="sample-yes" />
                            <Label htmlFor="sample-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id="sample-no" />
                            <Label htmlFor="sample-no" className="cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Price Display with Breakdown */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Base Price:</span>
                        <span className="font-medium">{product.base_price.toFixed(2)} SAR</span>
                      </div>
                      
                      {/* Show price modifiers */}
                      {Object.entries(getPriceModifiers()).map(([optionName, modifier]) => (
                        <div key={optionName} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{optionName}:</span>
                          <span className="font-medium text-primary">
                            {modifier > 0 ? '+' : ''}{modifier.toFixed(2)} SAR
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">×{quantity}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-lg font-semibold">Total Price:</span>
                        <span className="text-2xl font-bold text-primary">
                          {(totalPrice * quantity).toFixed(2)} SAR
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Price includes tax
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      <ShoppingCart className="ml-2 h-5 w-5" />
                      {addingToCart ? 'جاري الإضافة...' : 'إضافة للسلة'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="description" className="mt-6">
                    <div className="space-y-4">
                      {product.description_ar && (
                        <div>
                          <h3 className="font-semibold mb-2">الوصف</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {product.description_ar}
                          </p>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold mb-2">المواصفات</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• الحد الأدنى للطلب: {product.min_quantity} قطعة</li>
                          <li>• مدة التنفيذ: {product.production_time_days} أيام</li>
                          <li>• متوفر للطلب</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
