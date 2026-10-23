import express, { urlencoded } from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ dest: "upload/", storage: storage });

const app = express();
const PORT = 3000;
app.use(cors());
app.use(urlencoded());

app.post("/convert", upload.array("images", 20), async (req, res) => {
  try {
    const data = fs.readdirSync("./upload", { withFileTypes: true });
    console.log(data);
    await fs.rm("./upload", { recursive: true, force: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log("operation complete");
    });
    res.json({
      message: "Conversion received",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
