import React, {useState} from "react";
import CartProvider from "../src/cart/CartProvider";
import useCart from "../src/cart/useCart";
import CartItemCard from "../src/cart/CartItemCard";
import Button from "../src/components/Button";
import Modal from "./components/Modal.jsx";

function Shop() {
    const { addItem, cartItems } = useCart();

    // Sản phẩm giả lập
    const products = [
        { id: 1, name: "Giày cầu lông", price: 500000 },
        { id: 2, name: "Vợt cầu lông", price: 1200000 },
        { id: 3, name: "Áo thể thao", price: 250000 },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">🛒 Demo Giỏ hàng</h1>

            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-1 gap-4 mb-8">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="flex items-center justify-between border p-3 rounded-xl"
                    >
                        <div>
                            <h2 className="font-semibold">{p.name}</h2>
                            <p className="text-gray-600">Giá: {p.price} đ</p>
                        </div>
                        <Button onClick={() => addItem({ ...p, qty: 1 })}>
                            Thêm vào giỏ
                        </Button>
                    </div>
                ))}
            </div>

            {/* Giỏ hàng */}
            <h2 className="text-xl font-semibold mb-3">Giỏ hàng</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Chưa có sản phẩm nào trong giỏ.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <CartItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function App() {
    return (
        <>
            <CartProvider>
                <Shop/>
            </CartProvider>
        </>
    );
}
