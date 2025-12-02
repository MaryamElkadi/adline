import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Layers, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { Product, SimpleProductOption, QuantityPricingTier } from '@/types';

export default function SimpleProductOptions() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [options, setOptions] = useState<SimpleProductOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Option dialog state
  const [optionDialogOpen, setOptionDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<SimpleProductOption | null>(null);
  const [optionForm, setOptionForm] = useState({
    option_name_ar: '',
    option_name_en: '',
    option_value_ar: '',
    option_value_en: '',
    price_modifier: 0,
    is_available: true,
    display_order: 0,
  });

  // Quantity tier dialog state
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SimpleProductOption | null>(null);
  const [tiers, setTiers] = useState<QuantityPricingTier[]>([]);
  const [tierForm, setTierForm] = useState({
    min_quantity: 1,
    max_quantity: null as number | null,
    price_modifier: 0,
  });

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId]);

  const loadData = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const products = await api.getProducts();
      const productData = products.find(p => p.id === productId);
      const optionsData = await api.getSimpleProductOptions(productId);
      
      setProduct(productData || null);
      setOptions(optionsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOption = () => {
    setEditingOption(null);
    setOptionForm({
      option_name_ar: '',
      option_name_en: '',
      option_value_ar: '',
      option_value_en: '',
      price_modifier: 0,
      is_available: true,
      display_order: 0,
    });
    setOptionDialogOpen(true);
  };

  const handleEditOption = (option: SimpleProductOption) => {
    setEditingOption(option);
    setOptionForm({
      option_name_ar: option.option_name_ar,
      option_name_en: option.option_name_en || '',
      option_value_ar: option.option_value_ar,
      option_value_en: option.option_value_en || '',
      price_modifier: option.price_modifier,
      is_available: option.is_available,
      display_order: option.display_order,
    });
    setOptionDialogOpen(true);
  };

  const handleSaveOption = async () => {
    if (!productId) return;
    
    try {
      if (editingOption) {
        await api.updateSimpleProductOption(editingOption.id, optionForm);
        toast({
          title: 'Success',
          description: 'Option updated successfully',
        });
      } else {
        await api.createSimpleProductOption({
          product_id: productId,
          ...optionForm,
        });
        toast({
          title: 'Success',
          description: 'Option created successfully',
        });
      }
      
      setOptionDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save option',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteOption = async (id: string) => {
    try {
      await api.deleteSimpleProductOption(id);
      toast({
        title: 'Success',
        description: 'Option deleted successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete option',
        variant: 'destructive',
      });
    }
  };

  const handleManageTiers = async (option: SimpleProductOption) => {
    setSelectedOption(option);
    try {
      const tiersData = await api.getQuantityTiersForSimpleOption(option.id);
      setTiers(tiersData);
      setTierDialogOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load quantity tiers',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTier = async () => {
    if (!selectedOption) return;
    
    try {
      await api.createQuantityTierForSimpleOption({
        simple_option_id: selectedOption.id,
        min_quantity: tierForm.min_quantity,
        max_quantity: tierForm.max_quantity,
        price_modifier: tierForm.price_modifier,
      });
      
      const tiersData = await api.getQuantityTiersForSimpleOption(selectedOption.id);
      setTiers(tiersData);
      
      setTierForm({
        min_quantity: 1,
        max_quantity: null,
        price_modifier: 0,
      });
      
      toast({
        title: 'Success',
        description: 'Quantity tier created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create quantity tier',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!selectedOption) return;
    
    try {
      await api.deleteQuantityPricingTier(tierId);
      
      const tiersData = await api.getQuantityTiersForSimpleOption(selectedOption.id);
      setTiers(tiersData);
      
      toast({
        title: 'Success',
        description: 'Quantity tier deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete quantity tier',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found</p>
          <Button onClick={() => navigate('/admin/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Product Options</h1>
          <p className="text-muted-foreground mt-2">
            Manage options for: <strong>{product.name_ar}</strong>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Options</CardTitle>
              <CardDescription>
                Add options like size, material, color with custom prices
              </CardDescription>
            </div>
            <Button onClick={handleCreateOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option Name</TableHead>
                <TableHead>Option Value</TableHead>
                <TableHead>Price Modifier</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No options found. Add your first option.
                  </TableCell>
                </TableRow>
              ) : (
                options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell className="font-medium">
                      {option.option_name_en || option.option_name_ar}
                    </TableCell>
                    <TableCell>
                      {option.option_value_en || option.option_value_ar}
                    </TableCell>
                    <TableCell>
                      <span className={option.price_modifier > 0 ? 'text-green-600' : option.price_modifier < 0 ? 'text-red-600' : ''}>
                        {option.price_modifier > 0 ? '+' : ''}{option.price_modifier} SAR
                      </span>
                    </TableCell>
                    <TableCell>
                      {option.is_available ? (
                        <Badge variant="outline">Available</Badge>
                      ) : (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </TableCell>
                    <TableCell>{option.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageTiers(option)}
                        >
                          <Layers className="h-4 w-4 mr-1" />
                          Tiers
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOption(option)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOption(option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Option Dialog */}
      <Dialog open={optionDialogOpen} onOpenChange={setOptionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOption ? 'Edit Option' : 'Add Option'}</DialogTitle>
            <DialogDescription>
              Enter option details. Example: Size: Large (+20 SAR)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="option_name_en">Option Name (English)</Label>
                <Input
                  id="option_name_en"
                  value={optionForm.option_name_en}
                  onChange={(e) => setOptionForm({ ...optionForm, option_name_en: e.target.value })}
                  placeholder="e.g., Size, Material, Color"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option_name_ar">Option Name (Arabic)</Label>
                <Input
                  id="option_name_ar"
                  value={optionForm.option_name_ar}
                  onChange={(e) => setOptionForm({ ...optionForm, option_name_ar: e.target.value })}
                  placeholder="e.g., الحجم، المادة، اللون"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="option_value_en">Option Value (English)</Label>
                <Input
                  id="option_value_en"
                  value={optionForm.option_value_en}
                  onChange={(e) => setOptionForm({ ...optionForm, option_value_en: e.target.value })}
                  placeholder="e.g., Small, Large, Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option_value_ar">Option Value (Arabic)</Label>
                <Input
                  id="option_value_ar"
                  value={optionForm.option_value_ar}
                  onChange={(e) => setOptionForm({ ...optionForm, option_value_ar: e.target.value })}
                  placeholder="e.g., صغير، كبير، ممتاز"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_modifier">Price Modifier (SAR)</Label>
                <Input
                  id="price_modifier"
                  type="number"
                  step="0.01"
                  value={optionForm.price_modifier}
                  onChange={(e) => setOptionForm({ ...optionForm, price_modifier: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 20, -10, 0"
                />
                <p className="text-xs text-muted-foreground">
                  Positive = add to price, Negative = discount, 0 = no change
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={optionForm.display_order}
                  onChange={(e) => setOptionForm({ ...optionForm, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_available"
                checked={optionForm.is_available}
                onCheckedChange={(checked) => setOptionForm({ ...optionForm, is_available: checked })}
              />
              <Label htmlFor="is_available">Available</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOptionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveOption}>
                {editingOption ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quantity Tiers Dialog */}
      <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Quantity Tiers</DialogTitle>
            <DialogDescription>
              {selectedOption && (
                <>
                  Set different prices based on quantity ranges for: <strong>{selectedOption.option_value_en} ({selectedOption.option_value_ar})</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Current Tiers</Label>
              {tiers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                  No quantity tiers defined. Add your first tier below.
                </p>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Min Quantity</TableHead>
                        <TableHead>Max Quantity</TableHead>
                        <TableHead>Price Modifier</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tiers.map((tier) => (
                        <TableRow key={tier.id}>
                          <TableCell className="font-medium">{tier.min_quantity}</TableCell>
                          <TableCell>{tier.max_quantity || 'Unlimited'}</TableCell>
                          <TableCell>
                            <span className={tier.price_modifier > 0 ? 'text-green-600' : tier.price_modifier < 0 ? 'text-red-600' : ''}>
                              {tier.price_modifier > 0 ? '+' : ''}{tier.price_modifier} SAR
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTier(tier.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-semibold">Add New Tier</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_quantity">Min Quantity</Label>
                  <Input
                    id="min_quantity"
                    type="number"
                    min="1"
                    value={tierForm.min_quantity}
                    onChange={(e) => setTierForm({ ...tierForm, min_quantity: parseInt(e.target.value) || 1 })}
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_quantity">Max Quantity</Label>
                  <Input
                    id="max_quantity"
                    type="number"
                    min="1"
                    value={tierForm.max_quantity || ''}
                    onChange={(e) => setTierForm({ ...tierForm, max_quantity: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Leave empty for unlimited"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier_price_modifier">Price Modifier (SAR)</Label>
                  <Input
                    id="tier_price_modifier"
                    type="number"
                    step="0.01"
                    value={tierForm.price_modifier}
                    onChange={(e) => setTierForm({ ...tierForm, price_modifier: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
              <Button onClick={handleCreateTier} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Examples:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1-50 units: +20 SAR (small orders)</li>
                <li>• 51-100 units: +15 SAR (bulk discount)</li>
                <li>• 101+ units: +10 SAR (large bulk discount)</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setTierDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
