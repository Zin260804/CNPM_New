import { useEffect, useState } from "react";
import { Card, List, Tag, Typography, Empty, notification } from "antd";
import { getViewedProduct } from "../utils/productApi";

const { Title, Text, Paragraph } = Typography;

const ViewedProducts = () => {
    const [listViewProducts, setListViewProducts] = useState([]); // API trả về [{ product, viewedAt, ... }]
    const [loading, setLoading] = useState(false);

    const fetchViewed = async () => {
        try {
            setLoading(true);
            const res = await getViewedProduct();
            if (res?.EC === 0 && Array.isArray(res?.data)) {
                // chỉ hiển thị tối đa 4 sản phẩm
                setListViewProducts(res.data.slice(0, 4));
            } else {
                notification.error({
                    message: "Lỗi tải dữ liệu",
                    description: "Không lấy được danh sách đã xem.",
                });
                setListViewProducts([]);
            }
        } catch (e) {
            notification.error({
                message: "Lỗi tải dữ liệu",
                description: "Đã xảy ra lỗi khi tải danh sách.",
            });
            setListViewProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViewed();
    }, []);

    return (
        <div>
            {/* Thanh tiêu đề phía trên */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Sản phẩm đã xem
                </Title>
            </div>

            <List
                loading={loading}
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={listViewProducts}
                locale={{
                    emptyText: (
                        <Empty description={"Chưa có sản phẩm xem gần đây"} />
                    ),
                }}
                renderItem={(item) => {
                    const product = item?.product ?? {};
                    const name = product?.name ?? "(Không rõ tên)";
                    const description = product?.description;
                    const category = product?.category;
                    const currentPrice = product?.currentPrice; // fallback nếu API để giá trong product
                    const promotion = product?.promotion;
                    const views = product?.views ?? 0;

                    return (
                        <List.Item key={product?.id}>
                            <Card
                                hoverable
                                title={
                                    <div style={{ marginTop: 12, marginBottom: 12 }}>
                                        <div style={{ fontWeight: 500 }}>{name}</div>
                                        {category && <Tag color="blue">{category}</Tag>}
                                    </div>
                                }
                                style={{ height: "100%" }}
                            >
                                {description && (
                                    <Paragraph
                                        ellipsis={{ rows: 2, tooltip: description }}
                                        style={{ marginBottom: 12 }}
                                    >
                                        {description}
                                    </Paragraph>
                                )}

                                <div style={{ display: "grid", rowGap: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Giá</Text>
                                        <Text strong>
                                            {typeof currentPrice === "number"
                                                ? currentPrice.toLocaleString()
                                                : currentPrice ?? "-"}
                                        </Text>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Khuyến mãi</Text>
                                        <Text>{promotion ?? "-"}</Text>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Lượt xem</Text>
                                        <Text>{views}</Text>
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
