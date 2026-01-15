import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

/* =====================
   Cloudinary Config
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
    bodyParser: false,
  },
};

/* =====================
   Multer Config (Memory)
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
   Cloudinary Upload Helper
====================== */
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

/* =====================
   Parse JSON Helper
====================== */
const parseJSON = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/* =====================
   Add Project Handler
====================== */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  await connectDB();

  try {
    /* =====================
       Upload Middleware
    ====================== */
    await runMiddleware(
      req,
      res,
      upload.fields([
        { name: "featuredImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
        { name: "problemImage", maxCount: 1 },
        { name: "solutionImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 20 },
        { name: "technologiesUsedImages", maxCount: 20 },
      ])
    );

    const body = req.body;
    const files = req.files || {};

    /* =====================
       Required Fields
    ====================== */
    if (!body.title || !body.slug || !body.bannerDescription) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* =====================
       Slug Check
    ====================== */
    const exists = await Project.findOne({ slug: body.slug });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Project with this slug already exists",
      });
    }

    /* =====================
       Upload Images
    ====================== */
    const uploadSingle = async (field, folder) =>
      files[field]?.[0]
        ? await uploadToCloudinary(files[field][0].buffer, folder)
        : "";

    const uploadMultiple = async (field, folder) =>
      files[field]
        ? Promise.all(
            files[field].map((f) => uploadToCloudinary(f.buffer, folder))
          )
        : [];

    const [
      featuredImage,
      bannerImage,
      problemImage,
      solutionImage,
      galleryImages,
      technologiesUsedImages,
    ] = await Promise.all([
      uploadSingle("featuredImage", "projects/featured"),
      uploadSingle("bannerImage", "projects/banner"),
      uploadSingle("problemImage", "projects/problem"),
      uploadSingle("solutionImage", "projects/solution"),
      uploadMultiple("galleryImages", "projects/gallery"),
      uploadMultiple("technologiesUsedImages", "projects/technologies"),
    ]);

    /* =====================
       Create Project
    ====================== */
    const newProject = await Project.create({
      title: body.title,
      slug: body.slug,
      bannerDescription: body.bannerDescription,

      tag: parseJSON(body.tag, []),
      featureList: parseJSON(body.featureList, []),

      problem: body.problem || "",
      problemStatement: body.problemStatement || "",
      solution: body.solution || "",
      solutionOverview: body.solutionOverview || "",

      technologiesUsed: parseJSON(body.technologiesUsed, []),

      projectLink: body.projectLink || "",
      githubLink: body.githubLink || "",

      learned: body.learned || "",
      whatIlearned: body.whatIlearned || "",

      faq: parseJSON(body.faq, []),

      featuredImage,
      bannerImage,
      problemImage,
      solutionImage,
      galleryImages,
      technologiesUsedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Add Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}
