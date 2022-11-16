import mongoose, { Schema } from "mongoose";

const MessageSchema = Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("messages", MessageSchema);

export default Message;
