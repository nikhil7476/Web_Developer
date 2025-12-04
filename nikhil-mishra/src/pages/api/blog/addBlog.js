import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import multer from "multer";
import path from "path";
import fs from "fs";

// --- Disable Next.js default body parser (required for FormData uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Configure storage for uploaded images
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// --- Convert Multer to a Promise (for async/await)
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  await connectDB();

  try {
    // Run multer upload middleware
    await runMiddleware(req, res, upload.single("image"));

    const body = req.body;

    // Parse tags (stringified array)
    let tags = [];
    if (body.tag) {
      try {
        tags = JSON.parse(body.tag);
      } catch (err) {
        console.error("Tag parse error:", err);
      }
    }

    // Required fields validation
    if (!body.author || !body.title || !body.slug || !body.content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check slug uniqueness
    const existing = await Blog.findOne({ slug: body.slug });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists. Use a unique slug.",
      });
    }

    // Build new blog document
    const newBlog = new Blog({
      author: body.author,
      title: body.title,
      slug: body.slug,
      date: body.date || Date.now(),
      tag: tags,
      quote: body.quote || "",
      excerpt: body.excerpt || "",
      content: body.content, // Jodit HTML content

      // If image uploaded, save file path
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (err) {
    console.error("Error creating blog:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
}
