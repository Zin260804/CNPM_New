import { Input } from 'antd';

const { Search } = Input;

const ProductSearch = ({ value, setValue, setFilter }) => {
    return (
        <div style={{ marginBottom: 16 }}>
            <Search
                placeholder="Nhập tên sản phẩm..."
                allowClear
                enterButton="Tìm kiếm"
                size="middle"
                style={{ width: 400 }}
                value={value}   // 👈 controlled
                onChange={(e) => setValue(e.target.value)} // cập nhật state textSearch
                onSearch={(val) => {
                    setFilter(prev => ({
                        ...prev,
                        q: val,
                        page: 1
                    }));
                }}
            />
        </div>
    );
};


export default ProductSearch;