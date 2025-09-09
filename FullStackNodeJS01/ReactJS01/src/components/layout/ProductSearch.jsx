import { Input } from 'antd';

const { Search } = Input;

const ProductSearch = (props) => {
    return (
        <div style={{ marginBottom: 16 }}>
            <Search
                placeholder="Nhập tên sản phẩm..."
                allowClear
                enterButton="Tìm kiếm"
                size="middle"
                style={{ width: 400 }}
                onSearch={(value) => {
                    props.setFilter(prev => ({
                        ...prev,   // giữ nguyên các giá trị khác
                        q: value,  // chỉ cập nhật q
                        page: 1    // reset trang về 1 nếu muốn
                    }));
                }}
            />
        </div>
    );
};

export default ProductSearch;