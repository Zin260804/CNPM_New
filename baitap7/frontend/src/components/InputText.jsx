import React from "react";

const InputText = ({
        value,
        onChange,
        placeholder = "",
        type = "text",
        className = ""
})=>{
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-xl outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  ${className}`}
        />
    );
}
export default InputText