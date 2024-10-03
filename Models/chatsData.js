const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
  chats: [{
    senderName: {
      type: String
    },
    senderId: {
      type: String
    },
    content: {
      type: String,
        },
        time: {
          type: String,
            },
    contentType: {
      type: String,
    },
    contentNext: {
      type: String,
    },
    receiverName:{
      type:String
    }, 
     receiverId:{
      type:String
    }
  }]
});

const ChatsData = mongoose.model('ChatsData', chatSchema);

module.exports = ChatsData;