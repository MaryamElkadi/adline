import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { ProductOptionTemplate, ProductOptionValue, Product, ProductOptionAssignment } from '@/types';

export default function ProductOptions() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ProductOptionTemplate[]>([]);
  const [values, setValues] = useState<ProductOptionValue[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [assignments, setAssignments] = useState<ProductOptionAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Template dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProductOptionTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    option_type: '',
    option_name_ar: '',
    option_name_en: '',
    is_required: false,
    display_order: 0,
  });

  // Value dialog state
  const [valueDialogOpen, setValueDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<ProductOptionValue | null>(null);
  const [valueForm, setValueForm] = useState({
    template_id: '',
    value_ar: '',
    value_en: '',
    price_modifier: 0,
    is_available: true,
    display_order: 0,
  });

  // Assignment dialog state
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    product_id: '',
    template_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, valuesData, productsData, assignmentsData] = await Promise.all([
        api.getProductOptionTemplates(),
        api.getProductOptionValues(),
        api.getProducts(),
        api.getProductOptionAssignments(),
      ]);
      setTemplates(templatesData);
      setValues(valuesData);
      setProducts(productsData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Template handlers
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      option_type: '',
      option_name_ar: '',
      option_name_en: '',
      is_required: false,
      display_order: 0,
    });
    setTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: ProductOptionTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      option_type: template.option_type,
      option_name_ar: template.option_name_ar,
      option_name_en: template.option_name_en,
      is_required: template.is_required,
      display_order: template.display_order,
    });
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        await api.updateProductOptionTemplate(editingTemplate.id, templateForm);
        toast({ title: 'Success', description: 'Template updated successfully' });
      } else {
        await api.createProductOptionTemplate(templateForm);
        toast({ title: 'Success', description: 'Template created successfully' });
      }
      setTemplateDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save template',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.deleteProductOptionTemplate(id);
      toast({ title: 'Success', description: 'Template deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  // Value handlers
  const handleCreateValue = () => {
    setEditingValue(null);
    setValueForm({
      template_id: '',
      value_ar: '',
      value_en: '',
      price_modifier: 0,
      is_available: true,
      display_order: 0,
    });
    setValueDialogOpen(true);
  };

  const handleEditValue = (value: ProductOptionValue) => {
    setEditingValue(value);
    setValueForm({
      template_id: value.template_id,
      value_ar: value.value_ar,
      value_en: value.value_en,
      price_modifier: value.price_modifier,
      is_available: value.is_available,
      display_order: value.display_order,
    });
    setValueDialogOpen(true);
  };

  const handleSaveValue = async () => {
    try {
      if (editingValue) {
        await api.updateProductOptionValue(editingValue.id, valueForm);
        toast({ title: 'Success', description: 'Value updated successfully' });
      } else {
        await api.createProductOptionValue(valueForm);
        toast({ title: 'Success', description: 'Value created successfully' });
      }
      setValueDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save value',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteValue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this value?')) return;
    try {
      await api.deleteProductOptionValue(id);
      toast({ title: 'Success', description: 'Value deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete value',
        variant: 'destructive',
      });
    }
  };

  // Assignment handlers
  const handleCreateAssignment = () => {
    setAssignmentForm({
      product_id: '',
      template_id: '',
    });
    setAssignmentDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    try {
      await api.assignOptionToProduct(assignmentForm.product_id, assignmentForm.template_id);
      toast({ title: 'Success', description: 'Option assigned to product successfully' });
      setAssignmentDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign option',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return;
    try {
      await api.deleteProductOptionAssignment(id);
      toast({ title: 'Success', description: 'Assignment removed successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove assignment',
        variant: 'destructive',
      });
    }
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.option_name_en || 'Unknown';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name_ar || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Options Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage product option templates, values, and assignments
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Option Templates</CardTitle>
                  <CardDescription>Create and manage reusable option templates</CardDescription>
                </div>
                <Button onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name (English)</TableHead>
                    <TableHead>Name (Arabic)</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No templates found. Create your first template.
                      </TableCell>
                    </TableRow>
                  ) : (
                    templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.option_type}</TableCell>
                        <TableCell>{template.option_name_en}</TableCell>
                        <TableCell>{template.option_name_ar}</TableCell>
                        <TableCell>
                          {template.is_required ? (
                            <Badge>Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>{template.display_order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTemplate(template.id)}
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
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Option Values</CardTitle>
                  <CardDescription>Add values to templates with price modifiers</CardDescription>
                </div>
                <Button onClick={handleCreateValue}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Value
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Value (English)</TableHead>
                    <TableHead>Value (Arabic)</TableHead>
                    <TableHead>Price Modifier</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {values.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No values found. Create your first value.
                      </TableCell>
                    </TableRow>
                  ) : (
                    values.map((value) => (
                      <TableRow key={value.id}>
                        <TableCell className="font-medium">
                          {getTemplateName(value.template_id)}
                        </TableCell>
                        <TableCell>{value.value_en}</TableCell>
                        <TableCell>{value.value_ar}</TableCell>
                        <TableCell>
                          <span className={value.price_modifier > 0 ? 'text-green-600' : value.price_modifier < 0 ? 'text-red-600' : ''}>
                            {value.price_modifier > 0 ? '+' : ''}{value.price_modifier} SAR
                          </span>
                        </TableCell>
                        <TableCell>
                          {value.is_available ? (
                            <Badge variant="outline">Available</Badge>
                          ) : (
                            <Badge variant="destructive">Unavailable</Badge>
                          )}
                        </TableCell>
                        <TableCell>{value.display_order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditValue(value)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteValue(value.id)}
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
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Assignments</CardTitle>
                  <CardDescription>Assign option templates to products</CardDescription>
                </div>
                <Button onClick={handleCreateAssignment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Option
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Option Template</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No assignments found. Assign options to products.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          {getProductName(assignment.product_id)}
                        </TableCell>
                        <TableCell>{getTemplateName(assignment.template_id)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate ? 'Update the template details' : 'Create a new option template'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="option_type">Option Type</Label>
              <Input
                id="option_type"
                value={templateForm.option_type}
                onChange={(e) => setTemplateForm({ ...templateForm, option_type: e.target.value })}
                placeholder="e.g., size, material, design"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="option_name_en">Name (English)</Label>
              <Input
                id="option_name_en"
                value={templateForm.option_name_en}
                onChange={(e) => setTemplateForm({ ...templateForm, option_name_en: e.target.value })}
                placeholder="e.g., Size, Material"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="option_name_ar">Name (Arabic)</Label>
              <Input
                id="option_name_ar"
                value={templateForm.option_name_ar}
                onChange={(e) => setTemplateForm({ ...templateForm, option_name_ar: e.target.value })}
                placeholder="e.g., الحجم, المادة"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_required"
                checked={templateForm.is_required}
                onCheckedChange={(checked) => setTemplateForm({ ...templateForm, is_required: checked })}
              />
              <Label htmlFor="is_required">Required Option</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={templateForm.display_order}
                onChange={(e) => setTemplateForm({ ...templateForm, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                {editingTemplate ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Value Dialog */}
      <Dialog open={valueDialogOpen} onOpenChange={setValueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingValue ? 'Edit Value' : 'Create Value'}
            </DialogTitle>
            <DialogDescription>
              {editingValue ? 'Update the value details' : 'Add a new value to a template'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template_id">Template</Label>
              <Select
                value={valueForm.template_id}
                onValueChange={(value) => setValueForm({ ...valueForm, template_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.option_name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value_en">Value (English)</Label>
              <Input
                id="value_en"
                value={valueForm.value_en}
                onChange={(e) => setValueForm({ ...valueForm, value_en: e.target.value })}
                placeholder="e.g., Small, Large"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value_ar">Value (Arabic)</Label>
              <Input
                id="value_ar"
                value={valueForm.value_ar}
                onChange={(e) => setValueForm({ ...valueForm, value_ar: e.target.value })}
                placeholder="e.g., صغير, كبير"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_modifier">Price Modifier (SAR)</Label>
              <Input
                id="price_modifier"
                type="number"
                step="0.01"
                value={valueForm.price_modifier}
                onChange={(e) => setValueForm({ ...valueForm, price_modifier: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Positive for additional cost, negative for discount, 0 for no change
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_available"
                checked={valueForm.is_available}
                onCheckedChange={(checked) => setValueForm({ ...valueForm, is_available: checked })}
              />
              <Label htmlFor="is_available">Available</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value_display_order">Display Order</Label>
              <Input
                id="value_display_order"
                type="number"
                value={valueForm.display_order}
                onChange={(e) => setValueForm({ ...valueForm, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setValueDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveValue}>
                {editingValue ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Option to Product</DialogTitle>
            <DialogDescription>
              Select a product and an option template to assign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product_id">Product</Label>
              <Select
                value={assignmentForm.product_id}
                onValueChange={(value) => setAssignmentForm({ ...assignmentForm, product_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignment_template_id">Option Template</Label>
              <Select
                value={assignmentForm.template_id}
                onValueChange={(value) => setAssignmentForm({ ...assignmentForm, template_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.option_name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAssignment}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
