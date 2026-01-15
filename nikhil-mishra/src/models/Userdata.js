import mongoose from "mongoose";

const UserdataSchema = new mongoose.Schema(
  {
    /* =====================
       User Identity
    ====================== */
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },

    /* =====================
       Message Details
    ====================== */
    subject: { type: String, required: true },
    message_content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Userdata ||
  mongoose.model("Userdata", UserdataSchema);
