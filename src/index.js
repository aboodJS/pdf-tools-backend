import express, { urlencoded } from "express";
import cors from "cors";
import multer from "multer";
import { execFile } from "node:child_process";

const storage = multer.diskStorage({
  destination: function async(req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
const PORT = 3000;
app.use(cors());
app.use(urlencoded());

app.post("/convert", upload.array("images", 20), async (req, res) => {
  try {
    const files = req.files.map((e) => {
      return `./upload/${e.filename}`;
    });

    execFile("img2pdf", [...files, "--output", "./src/out.pdf"]);
    res.download("./src/out.pdf");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/word-to-pdf", upload.single("document"), async (req, res) => {
  console.log(req.file);
  try {
    await execFile(
      "libreoffice",
      [
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        ".",
        `../upload/${req.file.originalname}`,
      ],
      (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return error;
        }
      },
    );
    res.download(`./src/${req.file.originalname.split(".")[0]}.pdf`);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
