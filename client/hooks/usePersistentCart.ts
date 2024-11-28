import { Listing } from "@/types";
import { useState, useEffect, useCallback } from "react";

const usePersistentCart = () => {
  const [cart, setCart] = useState<Listing[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const updateLocalStorage = useCallback((newCart: Listing[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  }, []);

  const addToCart = useCallback((item: Listing) => {
    setCart((prevCart) => {
      const newCart = [...prevCart, item];
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [updateLocalStorage]);

  const removeFromCart = useCallback((itemId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== itemId);
      updateLocalStorage(newCart);
      return newCart;
    });
  }, [updateLocalStorage]);

  return { cart, addToCart, removeFromCart };
};

export default usePersistentCart;

