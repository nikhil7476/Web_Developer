import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

/* =====================
   Cloudinary Configuration
====================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/* =====================
   Next.js API Config
====================== */
export const config = {
  api: {
    bodyParser: false, // required for FormData
  },
};

/* =====================
   Multer Configuration
====================== */
const storage = multer.memoryStorage();
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
   Create Blog Handler
====================== */
export default async function handler(req, res) {
  /* =====================
     Method Validation
  ====================== */
  if (req.method !== "POST") {
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
       Parse Tags
    ====================== */
    let tags = [];
    if (body.tag) {
      try {
        tags = JSON.parse(body.tag);
      } catch (err) {
        console.error("Tag parse error:", err);
      }
    }

    /* =====================
       Required Field Validation
    ====================== */
    if (!body.author || !body.title || !body.slug || !body.content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* =====================
       Slug Uniqueness Check
    ====================== */
    const exists = await Blog.findOne({ slug: body.slug });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
    }

    /* =====================
       Image Upload (Cloudinary)
    ====================== */
    let imageUrl = null;

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "blogs" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({
              success: false,
              message: "Image upload failed",
            });
          }

          imageUrl = result.secure_url;

          const newBlog = new Blog({
            author: body.author,
            title: body.title,
            slug: body.slug,
            date: body.date || Date.now(),
            tag: tags,
            quote: body.quote || "",
            excerpt: body.excerpt || "",
            content: body.content,
            image: imageUrl,
          });

          await newBlog.save();

          return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: newBlog,
          });
        }
      );

      uploadStream.end(req.file.buffer);
      return;
    }

    /* =====================
       Create Blog (No Image)
    ====================== */
    const newBlog = new Blog({
      author: body.author,
      title: body.title,
      slug: body.slug,
      date: body.date || Date.now(),
      tag: tags,
      quote: body.quote || "",
      excerpt: body.excerpt || "",
      content: body.content,
      image: null,
    });

    await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully (no image)",
      data: newBlog,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}
