import express, { Application } from "express"; // nạp express
import bodyParser from "body-parser"; // nạp body-parser
import viewEngine from "./config/viewEngine"; // nạp viewEngine
import initWebRoutes from "./route/web"; // nạp file web từ Route
import connectDB from "./config/configdb";
import dotenv from "dotenv";

dotenv.config(); // load biến môi trường từ file .env

const app: Application = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);
connectDB();

const port: number = Number(process.env.PORT) || 6969; // gán kiểu number

// chạy server
app.listen(port, () => {
    console.log(`Backend Nodejs is running on the port: ${port}`);
});
