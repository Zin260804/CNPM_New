import { Col, notification, Row, List, Card, Pagination, Empty, Tag, Typography, Button } from "antd";
import { useEffect, useState } from "react";
import { getCategories, searchProducts } from "../utils/api";
import ProductFilter from "../components/ProductFilter.jsx";
import ProductSearch from "../components/ProductSearch.jsx";
import {getMyFavorites, postBuyProduct, postCommentProduct, toggleFavorite} from "../utils/productApi.js";
import {HeartOutlined, HeartFilled, ShoppingCartOutlined, MessageOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import ViewProduct from "./ViewProduct.jsx";
import ViewedProducts from "../components/VỉewedProducts.jsx";

const { Text, Paragraph } = Typography;

const ProductPage = () => {
    const [filter, setFilter] = useState({
        q: "",
        page: 1,
        limit: 10,
        category: "",
        minPrice: "",
        maxPrice: "",
        minPromotion: "",
        maxPromotion: "",
        sortBy: "",
        sortOrder: "",
    });
    const navigate = useNavigate();
    const [view, setView] = useState("all"); // "all" | "fav"  ✅ CHẾ ĐỘ HIỂN THỊ
    const [favoriteById, setFavoriteById] = useState({});
    const [favLoading, setFavLoading] = useState({});

    const [textSearch, setTextSearch] = useState("");
    const [listCategories, setListCategories] = useState([]);
    const [dataSource, setDatasource] = useState([]);
    const [dataPagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
    });

    const handleComment = async (id) => {
        await postCommentProduct(id);
    }

    const handleBuy = async (id) => {
        await postBuyProduct(id);
    }

    const fetchCategories = async () => {
        const res = await getCategories();
        if (res?.data) {
            setListCategories(res.data);
        } else {
            notification.error({ message: "Unauthorized", description: res?.message });
        }
    };

    // Lấy danh sách sản phẩm bình thường
    const fetchProducts = async () => {
        const res = await searchProducts(filter);
        if (res?.data) {
            setDatasource(res.data);
            setPagination(res.pagination);
        } else {
            notification.error({ message: "Unauthorized", description: res?.message });
        }
    };

    // Lấy danh sách yêu thích (dùng page/limit từ filter)
    const fetchFavorites = async () => {
            const res = await getMyFavorites(filter.page ?? 1, filter.limit); // API của bạn nhận page; limit = 10 cố định trong API
            // ⚠️ Nếu backend của bạn trả khác shape, chỉnh 2 dòng dưới cho khớp:
            if (res?.data) {
                setDatasource(res.data);
                setPagination(res.pagination);
            } else {
                notification.error({ message: "Unauthorized", description: res?.message });
            }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Khi filter hoặc view thay đổi -> gọi API tương ứng
    useEffect(() => {
        if (view === "fav") {
            fetchFavorites();
        } else {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, view]);

    // Phân trang (dùng chung cho cả 2 view)
    const handlePaginationChange = (page, pageSize) => {
        setFilter((prev) => ({
            ...prev,
            page,
            limit: pageSize,
        }));
    };

    const handlePageSizeChange = (_current, size) => {
        setFilter((prev) => ({
            ...prev,
            page: 1,
            limit: size,
        }));
    };

    // Toggle favorite cho từng card
    const handleToggleFavorite = async (id) => {
        try {
            setFavLoading((p) => ({ ...p, [id]: true }));
            const res = await toggleFavorite(id);
            if (res?.data?.EC === 0 && res?.data?.data) {
                const { favored } = res.data.data;
                setFavoriteById((prev) => ({ ...prev, [id]: favored }));
                notification.success({
                    message: "Thành công",
                    description: favored ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích",
                });

                // Nếu đang trong view "fav" và bạn bỏ yêu thích, có thể cần refresh lại danh sách
                if (view === "fav") {
                    // Tùy UX: có thể reload để item biến mất khỏi danh sách
                    fetchFavorites();
                }
            } else {
                notification.error({ message: "Lỗi", description: "Không thể cập nhật yêu thích" });
            }
        } finally {
            setFavLoading((p) => ({ ...p, [id]: false }));
        }
    };

    return (
       <>
           <div style={{ padding: 30 }}>
               {/* Thanh search + nút yêu thích trên cùng một hàng, nút màu hồng */}
               <div
                   style={{
                       display: "flex",
                       gap: 12,
                       marginBottom: 12,
                   }}
               >
                   <ProductSearch setFilter={setFilter} value={textSearch} setValue={setTextSearch} />

                   {/* Nút chuyển sang danh sách yêu thích */}
                   <Button
                       type="primary"
                       icon={<HeartOutlined />}
                       style={{
                           backgroundColor: "#eb2f96",
                           borderColor: "#eb2f96",
                       }}
                       onClick={() => {
                           setView("fav");
                           setFilter((prev) => ({ ...prev, page: 1 })); // chuyển view thì về trang 1
                       }}
                   >
                       Yêu thích
                   </Button>

                   {/* Nút quay lại tất cả sản phẩm (tuỳ chọn) */}
                   <Button
                       onClick={() => {
                           setView("all");
                           setFilter((prev) => ({ ...prev, page: 1 }));
                       }}
                   >
                       Tất cả
                   </Button>
               </div>

               <Row gutter={16}>
                   {/* Cột filter */}
                   <Col span={5}>
                       <ProductFilter setFilter={setFilter} setTextSearch={setTextSearch} listCategories={listCategories} />
                   </Col>

                   {/* Cột sản phẩm */}
                   <Col span={19}>
                       <List
                           grid={{
                               gutter: 16,
                               xs: 1,
                               sm: 2,
                               md: 2,
                               lg: 3,
                               xl: 4,
                               xxl: 4,
                           }}
                           dataSource={dataSource}
                           locale={{ emptyText: <Empty description={view === "fav" ? "Chưa có sản phẩm yêu thích" : "Không có sản phẩm"} /> }}
                           renderItem={(item) => (
                               <List.Item key={item.id}>
                                   <Card
                                       hoverable
                                       onClick={()=>navigate(`/${item.id}`)}
                                       actions={[
                                           (favoriteById[item.id] ?? item.favored ?? false) ? (
                                               <HeartFilled
                                                   key="favorite"
                                                   style={{ color: "red", fontSize: 20, opacity: favLoading[item.id] ? 0.5 : 1 }}
                                                   onClick={() => !favLoading[item.id] && handleToggleFavorite(item.id)}
                                               />
                                           ) : (
                                               <HeartOutlined
                                                   key="favorite"
                                                   style={{ fontSize: 20, opacity: favLoading[item.id] ? 0.5 : 1 }}
                                                   onClick={() => !favLoading[item.id] && handleToggleFavorite(item.id)}
                                               />
                                           ),

                                           // Bình luận
                                           <Button
                                               key="comment"
                                               type="text"
                                               size="small"
                                               icon={<MessageOutlined />}
                                               onClick={()=>handleComment(item.id)}
                                           >
                                               Bình luận
                                           </Button>,

                                           // Mua
                                           <Button
                                               key="buy"
                                               type="primary"
                                               size="small"
                                               icon={<ShoppingCartOutlined />}
                                               onClick={()=>handleBuy(item.id)}
                                           >
                                               Mua
                                           </Button>,
                                       ]}
                                       title={
                                           <div style={{ marginTop: 12, marginBottom: 12 }}>
                                               <div style={{ fontWeight: 500 }}>{item.name}</div>
                                               {item.category && <Tag color="blue">{item.category}</Tag>}
                                           </div>
                                       }
                                       style={{ height: "100%" }}
                                   >
                                       {item.description && (
                                           <Paragraph ellipsis={{ rows: 2, tooltip: item.description }} style={{ marginBottom: 12 }}>
                                               {item.description}
                                           </Paragraph>
                                       )}

                                       <div style={{ display: "grid", rowGap: 8 }}>
                                           <div style={{ display: "flex", justifyContent: "space-between" }}>
                                               <Text type="secondary">Giá</Text>
                                               <Text strong>
                                                   {typeof item.currentPrice === "number" ? item.currentPrice.toLocaleString() : item.currentPrice}
                                               </Text>
                                           </div>

                                           <div style={{ display: "flex", justifyContent: "space-between" }}>
                                               <Text type="secondary">Khuyến mãi</Text>
                                               <Text>{item.promotion ?? "-"}</Text>
                                           </div>

                                           <div style={{ display: "flex", justifyContent: "space-between" }}>
                                               <Text type="secondary">Lượt xem</Text>
                                               <Text>{item.views ?? 0}</Text>
                                           </div>
                                       </div>
                                   </Card>
                               </List.Item>
                           )}
                       />

                       {/* Phân trang (dùng chung, nhưng hoạt động đúng cho cả 2 view vì useEffect nghe theo [filter, view]) */}
                       <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                           <Pagination
                               current={dataPagination.currentPage}
                               pageSize={dataPagination.pageSize}
                               total={dataPagination.totalProducts}
                               showSizeChanger
                               pageSizeOptions={["5", "10", "20", "50"]}
                               showQuickJumper
                               onChange={handlePaginationChange}
                               onShowSizeChange={handlePageSizeChange}
                           />
                       </div>

                       <ViewedProducts/>
                   </Col>
               </Row>
           </div>

       </>
    );
};

export default ProductPage;
