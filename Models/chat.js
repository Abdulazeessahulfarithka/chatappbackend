import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;
const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      requird: true,
    },
    isGroupChat: {
      type: Boolean,
      required: true,
    },
    users: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: ObjectId,
      ref: "message",
    },
    groupAdmin: {
      type: ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
const Chat = mongoose.model("chat", chatSchema);
export { Chat };
