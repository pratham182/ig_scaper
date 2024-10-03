const PostData = require("./../Models/postData");
require("./connection");

const postSave = async (username, posts) => {
  try {
   console.log(posts);
    const parsedPosts = await posts.map(post => {
      const parsedPost = JSON.parse(post);
      return {
        postHref: parsedPost.postHref, // Use the postHref from the parsed object
        postSrc: parsedPost.postSrc,   // Use the postSrc from the parsed object
      };
    });

    // Create a new PostData document with the username and parsed posts
    const newPost = new PostData({
      username: username,  // Associate the posts with the username
      posts: parsedPosts,  // Attach the parsed posts
    });

    // Save the data to the database
    await newPost.save();
    console.log("Post data saved successfully for user:", username);
    console.log(parsedPosts); 
    return {success:true,status:"success",content:parsedPosts};
  } catch (error) {
    console.error("Error saving post data:", error);
    return {success:false,status:"fail",message:error};
  }
};

module.exports = postSave;
