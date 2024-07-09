import express from "express";
import { body, validationResult } from "express-validator";
import db from "./db.mjs";

const router = express.Router();

// バリデーションの設定
const validation = [
  body("name").notEmpty(),
  body("address").notEmpty(),
  body("tel").isLength({ min: 10, max: 11 }).matches(/^\d+$/),
  body("degree").notEmpty(),
  body("employeeNum").isInt({ min: 1 }).isLength({ min: 5, max: 5 }).matches(/^\d+$/),
];

// /showにGETリクエストが来た場合の処理
router.get("/show", function (req, res) {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(
        "データベースからのデータ取得中にエラーが発生しました:",
        err
      );
      res.status(500).json({ error: "データベースエラー" });
    } else {
      // console.log(JSON.stringify(result)); 
      res.status(200).json(result);
      console.log("Get Request received");
    }
  });
});

// /show/idにGETリクエストが来た場合の処理
router.get("/detail", function (req, res) {
  const id = req.query.id;
  // const queryGetDetail = `SELECT * FROM users WHERE id = ${id}`;
console.log("id:",req.query.id)
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(
        "データベースからのデータ取得中にエラーが発生しました:",
        err
      );
      res.status(500).json({ error: "データベースエラー" });
    } else {
      console.log(JSON.stringify(result)); 
      res.status(200).json(result); 
      console.log("Detail Request received");
    }
  });
});

// /createにPOSTリクエストが来たときの処理
// バリデーション突破できなかった場合はデータを追加しない
router.post("/create", validation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // リクエスト内容（データ）を取得する
  const newPerson = req.body;
  console.log("reqbody",req.body)

  //usersテーブルに社員情報を追加
  db.query("INSERT INTO users SET ?", [newPerson], (err, result) => {
    if (err) {
      return res.status(500).json();
    } else {
      newPerson.id = result.insertId;
      console.log("Succeed", newPerson);
      res.status(200).json(newPerson);
    }
  });
});

export default router;
