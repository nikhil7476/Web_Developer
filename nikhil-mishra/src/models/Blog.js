import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    tag: { type: [String], default: [] },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    quote: { type: String },
    excerpt: { type: String },
    content: { type: String, required: true },

    // Image upload fields
    image: { type: String, required: false }, // image URL or filename
    imageWidth: { type: Number, default: null },
    imageHeight: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
