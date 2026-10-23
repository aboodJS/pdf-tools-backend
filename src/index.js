import express, { urlencoded } from "express";
import cors from "cors";
import multer from "multer";

const upload = multer({ dest: "upload/" });

const app = express();
const PORT = 3000;
app.use(cors());
app.use(urlencoded());

app.post("/convert", upload.array("images", 20), (req, res) => {
  console.log(req.body);

  res.json({
    message: "Conversion received",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
