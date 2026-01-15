import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    /* =====================
       Core Blog Identity
    ====================== */
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },

    /* =====================
       Content & Summary
    ====================== */
    excerpt: { type: String },
    quote: { type: String },
    content: { type: String, required: true },

    /* =====================
       Tags & Classification
    ====================== */
    tag: { type: [String], default: [] },

    /* =====================
       Images & Media
    ====================== */
    image: { type: String },
    imageWidth: { type: Number, default: null },
    imageHeight: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
