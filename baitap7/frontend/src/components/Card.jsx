import React from "react";

const Card = (
    {
        image,
        title,
        description,
        footer,
        className = ""
    }) =>{

    return (
        <div className={`bg-white rounded-2xl shadow-md overflow-hidden p-4 ${className}`}>
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                />
            )}
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            {description && <p className="text-gray-600 mb-2">{description}</p>}
            {footer && <div className="mt-3">{footer}</div>}
        </div>
    );
}
export default Card