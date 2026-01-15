import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    /* =====================
       Core Project Identity
    ====================== */
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    bannerDescription: { type: String, required: true },

    /* =====================
       Tags & Highlights
    ====================== */
    tag: { type: [String], default: [] },
    featureList: { type: [String], default: [] },

    /* =====================
       Problem & Solution
    ====================== */
    problem: { type: String },
    solution: { type: String },
    problemStatement: { type: String },
    solutionOverview: { type: String },

    /* =====================
       Images & Media
    ====================== */
    featuredImage: { type: String },
    bannerImage: { type: String },
    problemImage: { type: String },
    solutionImage: { type: String },
    galleryImages: { type: [String], default: [] },
    technologiesUsedImages: { type: [String], default: [] },

    /* =====================
       Technologies & Links
    ====================== */
    technologiesUsed: { type: [String], default: [] },
    projectLink: { type: String },
    githubLink: { type: String },

    /* =====================
       Learnings & FAQs
    ====================== */
    learned: { type: String },
    whatIlearned: { type: String },
    faq: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
