require("dotenv").config();

const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const validateFiles = require("./Validate");
const JWTService = require("./services/JWTService");

const app = express();

const PORT = 5123;
const FILES_DIR = path.resolve("./files");

fs.mkdirSync(FILES_DIR, { recursive: true });

app.use(cors({
  origin: [process.env.CLIENT_URL ?? "http://localhost:5173"],
}));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, FILES_DIR);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
});

/* Health Check
 *
 *
 */

app.get("/health", (_, res) => {
  return res.status(200).json({
    status: "ok",
  });
})

function getBearerToken(req) {
  const authHeader = req.headers.authorization;

  return authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
}

function validateToken(req, res, next) {
  const token = getBearerToken(req);
  if (token == null) {
    return res.status(500).json({
      error: "NOT_AUTHORISED"
    });
  }
  try {
    JWTService.verify(token);
  } catch (err) {
    return res.status(500).json({
      error: "INVALID_TOKEN"
    });
  }
  next();
}

/*
 * Upload multiple files
 *
 * POST /files
 * Content-Type: multipart/form-data
 * Field name: files
 */
app.post("/files", validateToken, upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      error: "No files uploaded",
    });
  }

  validateFiles(req.files);

  const files = req.files.map((file) => ({
    storedName: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
  }));

  return res.status(201).json({
    files,
  });
});

/*
 * Fetch file
 *
 * GET /files/:id
 */
app.get("/files/:id", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "File not found",
    });
  }

  return res.sendFile(filePath);
});

/*
 * Delete file
 *
 * DELETE /files/:id
 */
app.delete("/files/:id", validateToken, (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "File not found",
    });
  }

  fs.unlinkSync(filePath);

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`File server running on port ${PORT}`);
});
