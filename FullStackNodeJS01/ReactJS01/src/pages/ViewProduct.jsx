import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductMetrics, getSimilarProducts, postViewProduct } from "../utils/productApi.js";
import { Card, Empty, List, notification, Tag, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

const ViewProduct = () => {
    const { id } = useParams();
    const [listSimilarProducts, setListSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productMetrics, setProductMetrics] = useState("");

    const countViewProduct = async (pid) => {
        await postViewProduct(pid);
    };

    const fetchProductMetrics = async () => {
        const res = await getProductMetrics(id);
        if (res?.EC === 0 && res.data) {
            setProductMetrics(res.data);
        }
    };

    const fetchSimilarProducts = async (pid, abortSignal) => {
        setLoading(true);
        try {
            const res = await getSimilarProducts(pid, { signal: abortSignal });
            if (res?.EC === 0 && Array.isArray(res?.data)) {
                setListSimilarProducts(res.data.slice(0, 4));
            } else {
                notification.error({
                    message: "Lỗi tải dữ liệu",
                    description: "Không lấy được danh sách sản phẩm tương tự.",
                });
                setListSimilarProducts([]);
            }
        } catch (e) {
            if (e?.name !== "AbortError") {
                notification.error({
                    message: "Lỗi tải dữ liệu",
                    description: "Đã xảy ra lỗi khi tải danh sách sản phẩm tương tự.",
                });
                setListSimilarProducts([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        countViewProduct(id);
        fetchProductMetrics();
        fetchSimilarProducts(id, controller.signal);
        return () => controller.abort();
    }, [id]);
    return (
        <div style={{ padding: 16 }}>
            {/* Hiển thị lượt bán & lượt comment */}
            {productMetrics && (
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text type="secondary">Lượt bán: {productMetrics.salesCount}</Text>

                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text type="secondary">Bình luận: {productMetrics.commentsCount}</Text>
                    </div>
                </div>
            )}

            {/* Thanh tiêu đề phía trên */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    padding: "4px 4px",
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    Sản phẩm tương tự
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
                dataSource={listSimilarProducts}
                locale={{ emptyText: <Empty description={"Chưa có sản phẩm tương tự"} /> }}
                renderItem={(item) => {
                    const name = item?.name ?? "(Không rõ tên)";
                    const description = item?.description;
                    const category = item?.category;
                    const currentPrice = item?.currentPrice;
                    const promotion = item?.promotion;
                    const views = item?.views ?? 0;

                    return (
                        <List.Item key={item?.id} style={{ padding: 8 }}>
                            <Card
                                hoverable
                                bodyStyle={{ padding: 16, display: "grid", gap: 12 }}
                                title={
                                    <div style={{ marginTop: 8, marginBottom: 8 }}>
                                        <div style={{ fontWeight: 500, lineHeight: 1.3 }}>{name}</div>
                                        {category && <Tag color="blue">{category}</Tag>}
                                    </div>
                                }
                                style={{ height: "100%" }}
                            >
                                {description && (
                                    <Paragraph ellipsis={{ rows: 2, tooltip: description }} style={{ margin: 0 }}>
                                        {description}
                                    </Paragraph>
                                )}

                                <div style={{ display: "grid", rowGap: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">Giá</Text>
                                        <Text strong>
                                            {typeof currentPrice === "number" ? currentPrice.toLocaleString() : currentPrice ?? "-"}
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

export default ViewProduct;
