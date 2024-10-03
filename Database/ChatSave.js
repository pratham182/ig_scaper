const ChatsData = require("./../Models/chatsData");
require("./connection");
const chatSave = async (chats) => {
    try {
      console.log(chats);
      const newChat = new ChatsData({
        chats: chats,
      });
      await newChat.save();
      console.log("Chat data saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving chat data:", error);
      return false
    }
  };
  module.exports = chatSave;