'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConnect } from '@/contexts/ConnectContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Loader2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
  } | null;
}

export default function ProductsPage() {
  const router = useRouter();
  const { account, loading: accountLoading } = useConnect();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!account?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/connect/products?accountId=${account.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account?.id) {
      fetchProducts();
    }
  }, [account?.id]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real app, you would call an API to archive/delete the product
      // For this example, we'll just filter it out from the UI
      setProducts(products.filter(p => p.id !== productId));
      // Show success message
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  if (accountLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!account?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Required</AlertTitle>
          <AlertDescription>
            You need to connect a Stripe account before managing products.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/dashboard/connect">
              Connect Stripe Account
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage the products you offer for rent
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>
            Products you're offering for rent through Dachbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any products yet.</p>
              <Button asChild>
                <Link href="/dashboard/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-xs">
                      {product.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      {product.default_price 
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: product.default_price.currency || 'USD',
                          }).format((product.default_price.unit_amount || 0) / 100)
                        : 'No price set'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.active ? 'default' : 'outline'}>
                        {product.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/products/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
