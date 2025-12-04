import mongoose from "mongoose";

const UserdataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    subject: { type: String, required: true },
    message_content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Userdata ||
  mongoose.model("Userdata", UserdataSchema);
