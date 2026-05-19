'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types';

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
    setLoading(false);
  };

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-primary mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}