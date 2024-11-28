"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Listing } from "@/types";

type CartContextType = {
  cart: Listing[];
  addToCart: (item: Listing) => void;
  removeFromCart: (itemId: number) => void;
  updateCart: (itemId: number, quantity: number) => void;
  deleteCart: () => void;
};

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Listing[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const updateLocalStorage = useCallback((newCart: Listing[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  }, []);

  const addToCart = useCallback(
    (item: Listing) => {
      setCart((prevCart) => {
        // Check if the item is already in the cart
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          const newCart = prevCart.map((cartItem) => {
            if (cartItem.id === item.id) {
              return {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              };
            }
            return cartItem;
          });
          updateLocalStorage(newCart);
          return newCart;
        }
        const newCart = [...prevCart, {
          ...item,
          quantity: 1,
        }];
        updateLocalStorage(newCart);
        return newCart;
      });
    },
    [updateLocalStorage]
  );

  const updateCart = useCallback(
    (itemId: number, quantity: number) => {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity,
            };
          }
          return item;
        });
        updateLocalStorage(newCart);
        return newCart;
      });
    },
    [updateLocalStorage]
  );

  const removeFromCart = useCallback(
    (itemId: number) => {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.id !== itemId);
        updateLocalStorage(newCart);
        return newCart;
      });
    },
    [updateLocalStorage]
  );

  const deleteCart = useCallback(() => {
    setCart([]);
    updateLocalStorage([]);
  }, [updateLocalStorage]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCart, deleteCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for accessing the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
