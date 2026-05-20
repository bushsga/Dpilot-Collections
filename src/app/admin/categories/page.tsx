'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data as Category[]);
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      name,
      slug: generateSlug(name),
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: formData.name.trim(), slug: formData.slug }])
      .select()
      .single();

    if (!error && data) {
      setCategories([...categories, data as Category]);
      setFormData({ name: '', slug: '' });
      setShowForm(false);
    } else {
      alert('Error: ' + (error?.message || 'Failed to add category'));
    }
    setSaving(false);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.name.trim()) return;

    setSaving(true);
    const { error } = await supabase
      .from('categories')
      .update({ name: formData.name.trim(), slug: formData.slug })
      .eq('id', editingId);

    if (!error) {
      setCategories(
        categories.map((c) =>
          c.id === editingId
            ? { ...c, name: formData.name.trim(), slug: formData.slug }
            : c
        )
      );
      setEditingId(null);
      setFormData({ name: '', slug: '' });
    } else {
      alert('Error: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will be uncategorized.`)) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      alert('Error: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ name: '', slug: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-primary">
          Categories ({categories.length})
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', slug: '' });
          }}
          className="flex items-center gap-2 bg-brand-accent text-white px-6 py-3 text-sm font-medium hover:bg-brand-primary transition-colors"
        >
          <FiPlus />
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showForm || editingId) && (
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="bg-white border border-brand-muted/10 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-brand-primary mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-primary mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
                placeholder="e.g., Sneakers"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-primary mb-2">
                Slug (auto-generated)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-brand-secondary text-brand-muted"
                placeholder="sneakers"
              />
              <p className="text-xs text-brand-muted mt-1">
                Used in the URL: /categories/sneakers
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-accent text-white px-6 py-2.5 text-sm font-medium hover:bg-brand-primary transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Category'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-brand-muted/30 text-brand-primary px-6 py-2.5 text-sm hover:bg-brand-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      {loading ? (
        <p className="text-brand-muted">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-brand-muted/10">
          <p className="text-brand-muted text-lg mb-2">No categories yet</p>
          <p className="text-brand-muted text-sm">
            Click "Add Category" to create your first category.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-brand-muted/10">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-muted/10 text-left">
                  <th className="p-4 text-sm font-medium text-brand-muted w-16">#</th>
                  <th className="p-4 text-sm font-medium text-brand-muted">Name</th>
                  <th className="p-4 text-sm font-medium text-brand-muted">Slug</th>
                  <th className="p-4 text-sm font-medium text-brand-muted w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="border-b border-brand-muted/5 hover:bg-brand-secondary/50 transition-colors"
                  >
                    <td className="p-4 text-sm text-brand-muted">{index + 1}</td>
                    <td className="p-4 text-sm font-medium text-brand-primary">
                      {category.name}
                    </td>
                    <td className="p-4 text-sm text-brand-muted font-mono">
                      {category.slug}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-brand-muted hover:text-brand-accent transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-brand-muted hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-brand-muted/5">
            {categories.map((category, index) => (
              <div key={category.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-primary">
                    {category.name}
                  </p>
                  <p className="text-xs text-brand-muted font-mono mt-0.5">
                    /{category.slug}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-brand-muted hover:text-brand-accent"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="text-brand-muted hover:text-red-600"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}