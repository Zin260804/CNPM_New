import { Col, notification, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { searchProducts } from "../utils/api";
import ProductFilter from "../components/layout/ProductFilter.jsx";
import ProductSearch from "../components/layout/ProductSearch.jsx";

const ProductPage = () => {
    const [filter, setFilter] = useState({
        q: "",
        page: 1,
        limit: 5, // ✅ thêm limit mặc định
        category: "",
        minPrice: "",
        maxPrice: "",
        minPromotion: "",
        maxPromotion: "",
        sortBy: "",
        sortOrder: "",
    });

    const [dataSource, setDatasource] = useState([]);
    const [dataPagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 5,
    });

    const fetchProduct = async () => {
        const res = await searchProducts(filter);
        if (res.data) {
            setDatasource(res.data);
            setPagination(res.pagination);
        } else {
            notification.error({message: "Unauthorized", description: res.message,});
        }
    };

    // ✅ Khi filter thay đổi → gọi API
    useEffect(() => {
        fetchProduct(filter);
    }, [filter]);


    // ✅ Đồng bộ phân trang Table với filter
    const handleTableChange = (pagination) => {
        setFilter((prev) => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize,
        }));
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: 'Price',
            dataIndex: 'currentPrice',
        },
        {
            title: "Views",
            dataIndex: "views",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <ProductSearch setFilter={setFilter} />
            <Row gutter={16}>
                {/* Cột filter (1/4 chiều rộng) */}
                <Col span={5}>
                    <ProductFilter setFilter={setFilter} />
                </Col>

                {/* Cột bảng (3/4 chiều rộng) */}
                <Col span={19}>
                    <Table
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            current: dataPagination.currentPage,
                            pageSize: dataPagination.pageSize,
                            total: dataPagination.totalProducts,
                            showSizeChanger: true, // cho phép đổi pageSize
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showQuickJumper: true,
                        }}
                        onChange={handleTableChange}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage;
