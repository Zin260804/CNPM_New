import React, { useState } from "react";
import CartContext from "./CartContext.jsx";

export default function CartProvider(props) {
    const [cartItems, setCartItems] = useState([]);

    const addItem = (item) => {
        setCartItems((prev) => {
            const existing = prev.find((p) => p.id === item.id);
            if (existing) {
                return prev.map((p) =>
                    p.id === item.id ? { ...p, qty: p.qty + item.qty } : p
                );
            }
            return [...prev, { ...item }];
        });
    };

    const updateItem = (id, qty) => {
        setCartItems((prev) =>
            prev.map((p) => (p.id === id ? { ...p, qty } : p))
        );
    };

    const removeItem = (id) => {
        setCartItems((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, updateItem, removeItem }}>
            {props.children}
        </CartContext.Provider>
    );
}
