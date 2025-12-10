// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [credits, setCredits] = useState(100000); // 100,000 credits

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('medicineCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      
      // Calculate totals
      calculateTotals(parsedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    calculateTotals(cart);
  }, [cart]);

  // Calculate total items and amount
  const calculateTotals = (cartItems) => {
    const items = cartItems.reduce((total, item) => total + item.quantity, 0);
    const amount = cartItems.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
    
    setTotalItems(items);
    setTotalAmount(amount);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Item already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Item not in cart, add new
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update quantity of an item
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      return prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Complete purchase
  const checkout = () => {
    if (totalAmount <= credits) {
      setCredits(prevCredits => prevCredits - totalAmount);
      clearCart();
      return { success: true, message: 'Purchase completed successfully!' };
    } else {
      return { success: false, message: 'Insufficient credits for this purchase.' };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      totalItems,
      totalAmount,
      credits,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};