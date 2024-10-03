const puppeteer = require("puppeteer");
const login = require('./Controllers/Login');
const isUserLoggedIn=require("./Controllers/IsUserLogin");

const profile = require('./Controllers/Profile');
const chats = require('./Controllers/Chats');
const posts = require('./Controllers/Post');
const chatSave = require("./Database/ChatSave");
const postSave = require("./Database/PostSave");
const {GoInstagram,handleDialogBox} = require("./Controllers/UtiltyFunction");
require("dotenv").config();
let name = null;

let isPostSaved = false;
let isChatSaved = false;

// const instagramChat = async (username, password) => {
//   // Launch the browser

//   const browser = await puppeteer.launch({
//     ...(process.env.NODE_ENV !== 'production' && { headless: false }),
//     userDataDir: './user_data',
//     args: [
//       "--disable-setuid-sandbox",
//       "--no-sandbox",
//       "--no-zygote",
//       // "--single-process",
//     ],
//   });

//       const page = await browser.newPage();
//       const iPhone = puppeteer.KnownDevices['iPhone 14 Pro Max'];
//       await page.emulate(iPhone);
//       await page.goto("https://www.instagram.com");


//       //Function to handling dialog boxes
//       async function handleDialogBox(page, buttonText) {
//         await page.evaluate((buttonText) => {
//           const buttons = document.querySelectorAll('div[role="button"], a, button');
//           const targetButton = Array.from(buttons).find(
//             (button) =>
//               button.textContent.toLowerCase().replace(/ /g, '').includes(buttonText.toLowerCase())
//           );
      
//           if (targetButton) {
//             targetButton.click();
//           } else {
//             console.log(
//               `The "${buttonText}" button was not found or does not have the expected text.`
//             );
//           }
//         }, buttonText);
//       }
      
//       // Checking if already logged-in or Not
//      isLoggedIn = await page.evaluate( async() => { 
//         let is = false;
//         let tries = 0;
//         while(true){
//           tries++;
//           console.log("Running while loop");
//          let sp =  document.querySelector('svg[aria-label="Explore"]');
//          if(sp){
//           console.log('found svg')
//           is = true;
//           break;
//          }
//          else if (!sp  && tries > 8){
//           break;
//          }
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//         }
//         if(is==true){
//         return { success: true, message: "User is already logged in." };

//         }
        
//       });

//       if(!isLoggedIn){
//      const status=await login(username,password,page);
       
//       // Waiting...
//   await page.waitForNavigation({ waitUntil: "networkidle0" }); 
//          // Handling Dailoge Box 1
//   handleDialogBox(page,'notnow');
 
//   // Handling Dailogbox 2
//   handleDialogBox(page,'cancel');
//   if(status==true){
//     console.log("Okay");
//     return { success: true, message: "Login successful." };
//   }else{
//     return {success:false,message:'Login failed. Please check your credentials'}
//   }
// // From Profile
//       }

//       // if(isLoggedIn){

       
//         // name =  await profile(username,page);
//         // const post = await posts(username,page);
//         // const saved = postSave(username,post);
//         // if(saved){
//         //   await page.waitForNavigation({ waitUntil: "networkidle0" ,timeout:60000});
//         //   isPostSaved = true;
//         // };
        
//         // From Chats
//         // if(isPostSaved){
//         //   const chatData = await chats(username,name,page);
//         //   const chatSaved = chatSave(chatData);
//         //   if(chatSaved){
//         //   isChatSaved = true
//         //   await page.waitForNavigation({ waitUntil: "networkidle0"});
//         //   return true;
//         //   }
//         // }
          
//       }

const instagramChat = async (username, password,res) => {
  // Launch the browser
 const {page , browser}=await GoInstagram();
  // Check if already logged in
  const loggedIn = await isUserLoggedIn(page);

  if (!loggedIn) {
    const status = await login(username, password, page);
    // Waiting...
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    // Handling Dialog Box 1
    await handleDialogBox(page, 'notnow');

    // Handling Dialog Box 2
    await handleDialogBox(page, 'cancel');

    if (status) {
      
      console.log("Hello");
      const expoler =  await page.waitForSelector('svg[aria-label="Explore"]', { visible: true, timeout: 10000 });
      console.log(expoler);
      if(expoler){
        console.log("Login successful.");
        const result = { success: true, status: 'success',message: "Login successful." };
        if (result.success) { // Check if the login was successful
          res.status(200).json(result); // Return the result object
        } else {
          res.status(500).json({ status: 'fail', message: result.message });
        }
      }
  await browser.close();
  return;
    } else {
      res.status(500).json({ success:false, status: 'fail', message: "Credential wrong" });
    await browser.close();
    }
  } else {
    const result = { success: true, status:'success' ,message: "User is already logged in." };

    if (result.success) { // Check if the login was successful
      res.status(200).json(result); // Return the result object
      await browser.close();
      return;
    } else {
      res.status(500).json({ status: 'fail', message: result.message });
      await browser.close();
    }
  }
};
module.exports = instagramChat;
