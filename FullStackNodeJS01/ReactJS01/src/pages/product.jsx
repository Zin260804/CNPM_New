import { message, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getProductsWithPaginate } from '../utils/api';

const ProductPage = () => {
    const [dataSource, setDatasource] = useState([]);
    const [dataPagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 5
    });
    const fetchProduct = async (page) => {
        const res = await getProductsWithPaginate(page);
        if (res.data) {
            setDatasource(res.data);
            console.log(res.data);
            setPagination(res.pagination)
            console.log(res.pagination);
        } else {
            notification.error({
                message: "Unauthorized",
                description: res.message,
            });
        }
    };
    const handleTableChange = (pagination) => {
        fetchProduct(pagination.current, pagination.pageSize);
    };
    useEffect(() => {
        fetchProduct(1);
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey="_id"
                pagination={{
                    current: dataPagination.currentPage,
                    pageSize: dataPagination.pageSize,
                    total: dataPagination.totalProducts,
                    showSizeChanger: false,
                    showQuickJumper: true,
                }}
                onChange={handleTableChange}
            />
        </div>
    )
}
export default ProductPage
