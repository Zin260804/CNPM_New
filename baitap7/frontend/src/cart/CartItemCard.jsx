import React, { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import InputText from "../components/InputText";
import Modal from "../components/Modal";
import useCart from "./useCart";

export default function CartItemCard({ item }) {
    const { updateItem, removeItem } = useCart();
    const [qty, setQty] = useState(item.qty);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdate = () => {
        updateItem(item.id, Number(qty));
    };

    const handleRemove = () => {
        removeItem(item.id);
        setIsModalOpen(false);
    };

    return (
        <>
            <Card
                title={item.name}
                description={`Giá: ${item.price} đ | Số lượng: ${item.qty}`}
                footer={
                    <div className="flex items-center gap-2">
                        <InputText
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="w-20"
                        />
                        <Button variant="primary" onClick={handleUpdate}>
                            Cập nhật
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Xóa
                        </Button>
                    </div>
                }
            />

            <Modal
                isOpen={isModalOpen}
                title="Xác nhận xóa"
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRemove}
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            </Modal>
        </>
    );
}
