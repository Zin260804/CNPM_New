import { useEffect, useState } from "react";
import { Card, List, Tag, Typography, Empty, notification } from "antd";
import { getViewedProduct } from "../utils/productApi";
const { Text, Paragraph } = Typography;

const ViewedProducts = () => {
    const [items, setItems] = useState([]); // API trả về [{ product, viewedAt }]
    const [loading, setLoading] = useState(true);

    const fetchViewed = async () => {

            setLoading(true);
            const res = await getViewedProduct();
            console.log("Viewed API:", res?.data);

            if (res?.data?.EC === 0 && Array.isArray(res?.data?.data)) {
                setItems(res.data.data); // dùng trực tiếp mảng data
            } else {
                notification.error({
                    message: "Lỗi tải dữ liệu",
                    description: "Không lấy được danh sách đã xem.",
                });
            }
    };

    useEffect(() => {
        fetchViewed();
    }, []);

    return (
        <div style={{ padding: 16 }}>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
                dataSource={items}
                loading={loading}
                locale={{ emptyText: loading ? null : <Empty description="Chưa có sản phẩm đã xem" /> }}
                renderItem={(it) => {
                    const p = it.product || {};
                    const viewedAtStr = it.viewedAt ? new Date(it.viewedAt).toLocaleString() : "";

                    return (
                        <List.Item key={p.id || p._id}>
                            <Card
                                hoverable
                                title={
                                    <div style={{ marginTop: 8, marginBottom: 8 }}>
                                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                                        {p.category && <Tag color="blue">{p.category}</Tag>}
                                    </div>
                                }
                            >
                                {p.description && (
                                    <Paragraph ellipsis={{ rows: 2, tooltip: p.description }} style={{ marginBottom: 12 }}>
                                        {p.description}
                                    </Paragraph>
                                )}
                                <div style={{ display: "grid", rowGap: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Giá hiện tại</Text>
                                        <Text strong>
                                            {typeof p.currentPrice === "number"
                                                ? p.currentPrice.toLocaleString()
                                                : p.currentPrice ?? "-"}
                                        </Text>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Khuyến mãi</Text>
                                        <Text>{p.promotion ?? "-"}</Text>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Lượt xem</Text>
                                        <Text>{p.views ?? 0}</Text>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Xem gần nhất</Text>
                                        <Text>{viewedAtStr}</Text>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default ViewedProducts;
