import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { DB } from "./config/db.js";
import { authRouter } from "./routes/authRoute.js";
import { productRoutes } from "./routes/productRoutes.js";
import { categoryRoute } from "./routes/CategoryRoutes.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/auth", authRouter);
app.use("/api/products",productRoutes);
app.use("/api/categories",categoryRoute);

app.get("/", (req, res) => {
  res.json({ message: 'E-Commerce API is running...' });
})
DB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  })
}).catch((err) => {
  console.log(err);
})