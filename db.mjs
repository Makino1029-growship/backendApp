import express from "express";
import apiRoutes from "./index.mjs";
import mysql from "mysql2";
import cors from "cors";
import env from "dotenv";
env.config("./.env");

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

// MySQLとの接続
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// 接続の成功/失敗を出力
db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected");
});

// /apiにリクエストが来たときに、apiRoutesを使うように設定
app.use("/api", apiRoutes);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server start: http://localhost:${PORT}`);
});

export default db;
