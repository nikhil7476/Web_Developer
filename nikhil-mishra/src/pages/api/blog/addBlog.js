import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// --------------------------------------------
// Cloudinary Config
// --------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Disable Next.js body parser for FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer: store file in memory buffer (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run middleware
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
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  await connectDB();

  try {
    // Run file upload middleware
    await runMiddleware(req, res, upload.single("image"));

    const body = req.body;

    // Parse tags
    let tags = [];
    if (body.tag) {
      try {
        tags = JSON.parse(body.tag);
      } catch (err) {
        console.error("Tag parse error:", err);
      }
    }

    // Required validation
    if (!body.author || !body.title || !body.slug || !body.content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check slug
    const exists = await Blog.findOne({ slug: body.slug });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // --------------------------------------------
    // Upload Image to Cloudinary
    // --------------------------------------------
    let imageUrl = null;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload_stream(
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

          // Save blog after image upload
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

      // Pipe buffer to cloudinary uploader
      uploadRes.end(req.file.buffer);
      return;
    }

    // --------------------------------------------
    // If no image uploaded
    // --------------------------------------------
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
