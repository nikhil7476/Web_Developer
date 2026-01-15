import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import multer from "multer";
import path from "path";
import fs from "fs";

/* =====================
   Next.js API Config
====================== */
export const config = {
  api: {
    bodyParser: false, // required for FormData
  },
};

/* =====================
   Upload Directory Setup
====================== */
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =====================
   Multer Configuration
====================== */
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

/* =====================
   Middleware Runner
====================== */
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

/* =====================
   Update Blog Handler
====================== */
export default async function handler(req, res) {
  /* =====================
     Method Validation
  ====================== */
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  /* =====================
     Database Connection
  ====================== */
  await connectDB();

  try {
    /* =====================
       File Upload Middleware
    ====================== */
    await runMiddleware(req, res, upload.single("image"));

    const body = req.body;

    /* =====================
       Required Validation
    ====================== */
    if (!body.slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required to update a blog",
      });
    }

    /* =====================
       Parse Tags
    ====================== */
    let tags;
    if (body.tag) {
      try {
        tags = JSON.parse(body.tag);
      } catch (error) {
        console.error("Tag parse error:", error);
      }
    }

    /* =====================
       Build Update Payload
    ====================== */
    const updateFields = {
      ...(body.author && { author: body.author }),
      ...(body.title && { title: body.title }),
      ...(tags && { tag: tags }),
      ...(body.date && { date: body.date }),
      ...(body.quote && { quote: body.quote }),
      ...(body.excerpt && { excerpt: body.excerpt }),
      ...(body.content && { content: body.content }),
    };

    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`;
    }

    /* =====================
       Update Blog
    ====================== */
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: body.slug },
      updateFields,
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    /* =====================
       Success Response
    ====================== */
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
