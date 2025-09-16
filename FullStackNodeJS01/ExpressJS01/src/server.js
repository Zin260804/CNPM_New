require('dotenv').config();
//import các nguồn cần dùng
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const productRoutes = require('./routes/products');
const connection = require('./config/database');
const getHomepage = require('./controllers/homeController');
const syncProductsToES = require('./sync');
const cors = require('cors');

//cấu hình app, nếu tìm thấy port trong env, không thì trả về 8888
const app = express();
const port = process.env.PORT || 8888;

//config cors
app.use(cors());
//cấu hình req.body cho json
app.use(express.json());
//cho form data
app.use(express.urlencoded({ extended: true }));

//config template engine
configViewEngine(app);

//config route cho view ejs
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use('/', webAPI);
//khai báo route cho API
app.use('/v1/api/', apiRoutes);
app.use('/api/products', productRoutes);
(async () => {
    try {
        //kết nối database using mongoose
        await connection();
        //lắng nghe port trong env

        // 👉 gọi sync ở đây

        await syncProductsToES();

        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();