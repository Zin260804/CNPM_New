import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {postViewProduct} from "../utils/productApi.js";

const ViewProduct = ()=>{
    const { id } = useParams();
    const countViewProduct = async () => {
        const res = await postViewProduct(id);
        if (res?.data?.EC === 0 && res?.data?.data) {
            console.log(res.data.data)
        }
    };
    useEffect(() => {
        countViewProduct();
    }, []);
    return (
        <div>
            Bạn đang xem sản phẩm {id}
        </div>
    )
}
export default  ViewProduct
