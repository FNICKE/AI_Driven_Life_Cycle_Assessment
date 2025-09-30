import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "Prediction route working!" });
});

export default router;
