const instagramChat = require('./app');
const axios = require('axios');
const express = require('express');
const cors = require('cors'); // Import cors
const {GoInstagram,handleDialogBox} = require('./Controllers/UtiltyFunction');
const isUserLogin =require("./Controllers/IsUserLogin");
const PostData = require('./Models/postData');
const profile=require("./Controllers/Profile")
const postSave=require("./Database/PostSave")
const post=require("./Controllers/Post");
const app = express();


// Use cors middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json()); // Make sure to include this line

// API to get Insta chats

app.get('/login', async (req, res) => {
    try {
        // const { username, password } = req.body;
        const username = process.env.instaUserName;
        const password = process.env.instaPassword;
 await instagramChat(username, password,res); // Update this line to assign the result to a variable
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'fail', message: error.message });
  }
});


app.post("/posts",async(req,res)=>{
  let browser = null;
  try{
    let {page , browser} = await GoInstagram();
    const login=await isUserLogin(page);
   
    if(!login){
      res.status(500).json({status:'fail',message:"Unauthorized access"})
      await browser.close();
    }
    const username=req.body.data;
    // const username = 'liyanshmehta';
    await handleDialogBox(page, 'not now');
   
    const {status,type,content} =  await profile(username,page);
    if(status !== 'success' ){
      res.status(200).json({status:'fail',type:type,content:content})
     await browser.close();
    }
    else{
      try {
        const extractedPosts = await post(username,page);
        const dbSaved = await postSave(username,extractedPosts);
        if(!dbSaved || dbSaved.success==false){
          res.status(404).json({status:'fail',type:'404' ,content:"Something went wrong with db"});
          await browser.close();
        }
        else if(dbSaved.success) {
          res.status(200).json({
            status:'success',
            type:"Saved in Database",
            content:dbSaved.content,
          });
          await browser.close();
        }
        
      } catch (err) {
        res.status(500).json({status:'fail',type:'500' ,content:err});
        await browser.close();
      }
    }
        
  }catch(err){
    console.log(err);
    res.status(500).json({status:'fail',type:'500' ,content:err});
    await browser.close();
  }
});



app.get("/posts",async(req,res)=>{
  try{
    const username=req.body;
   const posts=await PostData.findOne({
    username:username
   });

   if(posts){
    res.status(200).json({
      success:true,
      status:"successful",
       posts
    });
   }else{
    res.status(500).json({
      success:false,
      status:"fail",
      message:"Not Found"
    });
   }

  }catch(err){
    console.log(err);
    res.status(500).json({
      success:false,
      status:"fail",
      message:"Internal server error"
    });
  }



})

app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url; // Get the image URL from the query parameters
  try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      res.set('Content-Type', 'image/jpeg');
      res.send(response.data);
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image');
  }
});


app.get("/",(req,res)=>{
  console.log("Hey");
  res.send("Hello");
})
const port=process.env.port || 5000;
app.listen(port, () => {
    console.log("Server is listening on port: 5000");
});
