import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      required: true,
    },
    chat: {
      type: ObjectId,
      ref: "chat",
    },
    readBy: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export { Message };
