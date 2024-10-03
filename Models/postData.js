const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Associate each set of posts with a username
  },
  posts: [{
    postHref: {
      type: String,
      required: true // URL to the post on Instagram
    },
    postSrc: {
      type: String,
      required: true // Image or video URL source
    }
      // ,
    // type: {
    //   type: String,
    //   enum: ['Image', 'Video'], 
     
    // }
  }]
});

const PostData = mongoose.model('PostData', postSchema);

module.exports = PostData;
