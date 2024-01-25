import { Message } from "../Models/message.js";

import { Chat } from "../Models/chat.js";

const sendMessage = async (req, res) => {
  try {
    const { content, chat } = req.body;

    if (!content || !chat) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chat,
    };

    // Create a new message
    const message = await new Message(newMessage).save();

    // Populate sender, chat, and user information
    const populatedMessage = await message
      .populate("sender", "name pic")
      .populate("chat")
      .execPopulate();

    // Populate user information in the chat
    const populatedChat = await Chat.findByIdAndUpdate(
      chat,
      { latestMessage: populatedMessage },
      { new: true }
    ).populate("users", "name pic email");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
      chat: populatedChat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    if (!messages) {
      return res.status(400).json({ error: "Error in fetching the messages" });
    }

    res.status(200).json({ data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { sendMessage, allMessages };
