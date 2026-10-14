const ALLOWED_MIME_TYPES = new Set([
  // Video
  "video/mp4",
  "video/x-matroska",       // mkv
  "video/x-msvideo",        // avi
  "video/quicktime",        // mov
  "video/x-ms-wmv",         // wmv
  "video/x-flv",            // flv
  "video/webm",

  // Image
  "image/jpeg",             // jpg, jpeg
  "image/png",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/webp",
  "image/tiff",
  "image/x-icon",           // ico

  // Compressed
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-bzip2",
  "application/x-xz",
  "application/x-iso9660-image",
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILES = 10;

module.exports = function validateFiles(files) {
  if (!files || files.length === 0) {
    throw new Error("At least one file is required.");
  }

  if (files.length > MAX_FILES) {
    throw new Error(
      `You can upload a maximum of ${MAX_FILES} files.`
    );
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new Error(
        `File type ${file.mimetype} is not allowed.`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `${file.originalname} exceeds the 50 MB limit.`
      );
    }
  }
}
