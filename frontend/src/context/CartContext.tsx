import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Equipment } from '../types/Equipment';

interface CartItem {
    equipment: Equipment;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (equipment: Equipment, quantity?: number) => void;
    removeFromCart: (equipmentId: number) => void;
    updateQuantity: (equipmentId: number, quantity: number) => void;
    clearCart: () => void;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (equipment: Equipment, quantity: number = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.equipment.id === equipment.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.equipment.id === equipment.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { equipment, quantity }];
        });
    };

    const removeFromCart = (equipmentId: number) => {
        setItems(prevItems => prevItems.filter(item => item.equipment.id !== equipmentId));
    };

    const updateQuantity = (equipmentId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(equipmentId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.equipment.id === equipmentId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
