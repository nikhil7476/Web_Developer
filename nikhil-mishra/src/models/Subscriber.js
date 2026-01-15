import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    /* =====================
       Subscriber Identity
    ====================== */
    email: { type: String, required: true, unique: true },

    /* =====================
       Metadata
    ====================== */
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);
