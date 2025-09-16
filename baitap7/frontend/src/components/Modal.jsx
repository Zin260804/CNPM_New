import React from "react";
import Button from "./Button";

const Modal = (
    {
        isOpen,
        title,
        children,
        onClose,
        onConfirm
    }) => {
    if (!isOpen){
        return null;
    }
    else
    {
        console.log("Đã mớ")
    }
    console.log("Modal opened with title:", title);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    {onConfirm && <Button variant="primary" onClick={onConfirm}>Confirm</Button>}
                </div>
            </div>
        </div>
    );
}

export default Modal
