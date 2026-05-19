'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';
import type { Product, Category } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface ProductFormProps {
  product?: Product | null; // If provided, we're editing
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!product;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || 'Fully boxed and equipped',
    price: product?.price?.toString() || '',
    category_slug: product?.category_slug || '',
    sizes: product?.sizes?.join(', ') || '',
    images: product?.images || [],
    in_stock: product?.in_stock ?? true,
    featured: product?.featured ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Parse sizes from comma-separated string to number array
      const sizesArray = formData.sizes
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_slug: formData.category_slug || null,
        sizes: sizesArray,
        images: formData.images,
        in_stock: formData.in_stock,
        featured: formData.featured,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) throw updateError;
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);

        if (insertError) throw insertError;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) throw deleteError;

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4">
          {error}
        </div>
      )}

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-brand-primary mb-2">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
          placeholder="e.g., NEW INN QUALITY ORIGINAL LOUIS VUITTON TIMBERLAND"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-brand-primary mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white resize-none"
          placeholder="e.g., FULLY BOXED AND EQUIPPED"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-brand-primary mb-2">
          Price (₦) *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="1"
          step="0.01"
          className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
          placeholder="e.g., 65000"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-brand-primary mb-2">
          Category
        </label>
        <select
          name="category_slug"
          value={formData.category_slug}
          onChange={handleChange}
          className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-medium text-brand-primary mb-2">
          Sizes (comma-separated)
        </label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
          placeholder="e.g., 41, 42, 43, 44, 45, 46, 47"
        />
        <p className="text-xs text-brand-muted mt-1">Separate sizes with commas</p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-brand-primary mb-2">
          Product Images
        </label>
        <ImageUpload
          images={formData.images}
          onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
          maxImages={5}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="in_stock"
            checked={formData.in_stock}
            onChange={handleChange}
            className="w-4 h-4 border-brand-muted/30 focus:ring-brand-accent"
          />
          <span className="text-sm text-brand-primary">In Stock</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 border-brand-muted/30 focus:ring-brand-accent"
          />
          <span className="text-sm text-brand-primary">Featured</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4 border-t border-brand-muted/10">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-accent text-white px-8 py-3 text-sm font-medium hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="border border-brand-muted/30 text-brand-primary px-8 py-3 text-sm hover:bg-brand-secondary transition-colors"
        >
          Cancel
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto border border-red-300 text-red-600 px-8 py-3 text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}