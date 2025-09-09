import { Checkbox, Card, Select, InputNumber } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const ProductFilter = ({ setFilter }) => {
    const [priceValue, setPriceValue] = useState("");
    const [categoryValue, setCategoryValue] = useState("");
    const [sortBy, setSortBy] = useState(""); // views hoặc currentPrice
    const [sortOrder, setSortOrder] = useState("desc"); // asc hoặc desc
    const [promotionRange, setPromotionRange] = useState({ min: "", max: "" });

    // ---- Filter Giá ----
    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPriceValue(value);
        let minPrice, maxPrice;

        switch (value) {
            case "cheap": minPrice = 0; maxPrice = 100; break;
            case "medium": minPrice = 100; maxPrice = 500; break;
            case "expensive": minPrice = 500; maxPrice = 999; break;
            default: minPrice = maxPrice = undefined;
        }

        setFilter(prev => ({
            ...prev,
            minPrice,
            maxPrice,
            page: 1
        }));
    };

    // ---- Filter Danh mục ----
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategoryValue(value);
        setFilter(prev => ({
            ...prev,
            category: value,
            page: 1
        }));
    };

    // ---- Filter Khuyến mãi ----
    const handlePromotionChange = (type, value) => {
        const newRange = { ...promotionRange, [type]: value };
        setPromotionRange(newRange);
        setFilter(prev => ({
            ...prev,
            minPromotion: newRange.min || undefined,
            maxPromotion: newRange.max || undefined,
            page: 1
        }));
    };

    // ---- Sort ----
    const handleSortChange = (type, value) => {
        if (type === "by") setSortBy(value);
        if (type === "order") setSortOrder(value);
        setFilter(prev => ({
            ...prev,
            sortBy: type === "by" ? value : prev.sortBy,
            sortOrder: type === "order" ? value : prev.sortOrder,
            page: 1
        }));
    };

    return (
        <Card title="Bộ lọc sản phẩm" size="small" style={{ marginBottom: 16 }}>
            {/* Giá */}
            <div style={{ marginBottom: 16 }}>
                <strong>Giá:</strong>
                {["cheap","medium","expensive"].map(val => (
                    <div key={val}>
                        <Checkbox
                            value={val}
                            checked={priceValue === val}
                            onChange={handlePriceChange}
                        >
                            {val === "cheap" ? "Giá rẻ < 100k" :
                                val === "medium" ? "100k - 500k" : "> 500k"}
                        </Checkbox>
                    </div>
                ))}
            </div>

            {/* Danh mục */}
            <div style={{ marginBottom: 16 }}>
                <strong>Danh mục:</strong>
                {["Racket","Shuttlecock","Shoes","Accessories"].map(val => (
                    <div key={val}>
                        <Checkbox
                            value={val}
                            checked={categoryValue === val}
                            onChange={handleCategoryChange}
                        >
                            {val}
                        </Checkbox>
                    </div>
                ))}
            </div>

            {/* Khuyến mãi */}
            <div style={{ marginBottom: 16 }}>
                <strong>Khuyến mãi (%):</strong>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <InputNumber
                        min={0}
                        max={100}
                        placeholder="Min"
                        value={promotionRange.min}
                        onChange={(val) => handlePromotionChange("min", val)}
                    />
                    -
                    <InputNumber
                        min={0}
                        max={100}
                        placeholder="Max"
                        value={promotionRange.max}
                        onChange={(val) => handlePromotionChange("max", val)}
                    />
                </div>
            </div>

            {/* Sắp xếp */}
            <div>
                <strong>Sắp xếp:</strong>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <Select value={sortBy} style={{ width: 120 }} onChange={(val) => handleSortChange("by", val)}>
                        <Option value="">Mặc định</Option>
                        <Option value="views">Lượt xem</Option>
                    </Select>
                    <Select value={sortOrder} style={{ width: 100 }} onChange={(val) => handleSortChange("order", val)}>
                        <Option value="asc">Tăng dần</Option>
                        <Option value="desc">Giảm dần</Option>
                    </Select>
                </div>
            </div>
        </Card>
    );
};

export default ProductFilter;
