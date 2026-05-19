'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { createClient } from '@/lib/supabase/client';
import type { Product, Category } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    // Fetch product and categories in parallel
    const [productRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (productRes.data) setProduct(productRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  if (!product) {
    return <p className="text-red-600">Product not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-primary mb-8">Edit Product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}