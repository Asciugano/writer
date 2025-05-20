import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserID = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserID },
    }).select("-password");

    res.status(200).json({ filteredUsers });
  } catch (error) {
    console.error("error in getUsersForSidebar", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatID } = req.params;
    const myID = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderID: myID, reciverID: userToChatID },
        { senderID: userToChatID, reciverID: myID },
      ],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("error in getMessages", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverID } = req.params;
    const senderID = req.user._id;

    let imgUrl;
    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }

    const newMessage = Message({
      senderID: senderID,
      reciverID: reciverID,
      text: text,
      image: imgUrl,
    });

    await newMessage.save();

    // todo
    // realtime functionality

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("error in sendMessage", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};