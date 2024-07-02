import express from "express";
import { body, validationResult } from "express-validator";
import db from "./db.mjs";

const router = express.Router();

// バリデーションの設定
const varidation = [
  body("name").notEmpty(),
  body("address").notEmpty(),
  body("tel").isInt({ min: 1 }),
  body("degree").notEmpty(),
  body("employeeNum").isInt({ min: 1 }),
];

// /createにPOSTリクエストが来たときの処理
// バリデーション突破できなかった場合はデータを追加しない
router.post("/create", varidation, async (req, res) => {
  if (validationResult(req).isEmpty) {
    // リクエスト内容（データ）を取得する
    const newPerson = req.body;
    //usersテーブルに社員情報を追加
    db.query("INSERT INTO users SET ?", [newPerson], (err, result) => {
      newPerson.id = result.insertId;
      res.json(newPerson);
    });
  }
});

export default router;
