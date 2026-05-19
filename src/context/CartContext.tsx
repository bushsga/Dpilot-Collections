'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, ProductVariant, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant | null; size: number | null } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string | null; size: number | null } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string | null; size: number | null; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant | null, size: number | null) => void;
  removeItem: (productId: string, variantId: string | null, size: number | null) => void;
  updateQuantity: (productId: string, variantId: string | null, size: number | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getItemKey: (productId: string, variantId: string | null, size: number | null) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate a unique key for each cart item (product + variant + size combo)
const getItemKey = (productId: string, variantId: string | null, size: number | null): string => {
  return `${productId}-${variantId ?? 'novariant'}-${size ?? 'nosize'}`;
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, size } = action.payload;
      const key = getItemKey(product.id, variant?.id ?? null, size);
      const existingItemIndex = state.items.findIndex(
        (item: CartItem) => getItemKey(item.product.id, item.variant?.id ?? null, item.size) === key
      );

      // Check available stock
      const availableStock = variant ? variant.quantity : product.quantity;
      const currentQty = existingItemIndex > -1 ? state.items[existingItemIndex].quantity : 0;

      if (currentQty >= availableStock) {
        alert(`Only ${availableStock} available in stock.`);
        return state;
      }

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return { items: newItems };
      }

      return {
        items: [...state.items, { product, variant, size, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM': {
      const { productId, variantId, size } = action.payload;
      return {
        items: state.items.filter(
          (item: CartItem) => getItemKey(item.product.id, item.variant?.id ?? null, item.size) !== getItemKey(productId, variantId, size)
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variantId, size, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (item: CartItem) => getItemKey(item.product.id, item.variant?.id ?? null, item.size) !== getItemKey(productId, variantId, size)
          ),
        };
      }
      return {
        items: state.items.map((item: CartItem) =>
          getItemKey(item.product.id, item.variant?.id ?? null, item.size) === getItemKey(productId, variantId, size)
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial: CartState) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dpilot-cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { items: parsed.items || [] };
        } catch {
          return initial;
        }
      }
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dpilot-cart', JSON.stringify(state));
    }
  }, [state]);

  const addItem = (product: Product, variant: ProductVariant | null, size: number | null) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, size } });
  };

  const removeItem = (productId: string, variantId: string | null, size: number | null) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId, size } });
  };

  const updateQuantity = (productId: string, variantId: string | null, size: number | null, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems: number = state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice: number = state.items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, getItemKey }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}