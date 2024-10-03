const puppeteer =require("puppeteer");
const GoInstagram=async()=>{
  const browser = await puppeteer.launch({
    headless: true,  // Ensure headless mode is always used
    userDataDir: './user_data',
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--no-zygote',
      '--disable-dev-shm-usage',  // Prevent crashes in low-memory environments
      '--single-process',         // Helps avoid resource bottlenecks on Render
      '--disable-gpu',            // Disable GPU for environments that don't have GPU
    ],
  });
  

  // const browser = await puppeteer.launch({
  //   headless: true,  // Ensure headless mode is true
  //   userDataDir: './user_data', 
  //   args: [
  //     '--no-sandbox',  // Disable sandboxing
  //     '--disable-setuid-sandbox',
  //     '--disable-dev-shm-usage',  // Prevent crashes in low-memory environments
  //     '--disable-gpu',  // Disable GPU usage
  //     '--remote-debugging-port=9222',  // Enable remote debugging
  //     '--disable-extensions',  // Disable any extensions
  //     '--single-process'  // Run in a single process
  //   ],
  // });
  
    
      const page = await browser.newPage();
      const iPhone = puppeteer.KnownDevices['iPhone 14 Pro Max'];
      await page.emulate(iPhone);
      await page.goto("https://www.instagram.com/accounts/login/?next=%2F&source=mobile_nav");
      return {page , browser};
}

async function handleDialogBox(page, buttonText) {
    // await page.waitForNavigation({ waitUntil: "networkidle0" }); 
await page.waitForSelector("div[role='button'], a, button",{ visible: true, timeout: 5000 })
  
    await page.evaluate((buttonText) => {
      const buttons = document.querySelectorAll('div[role="button"], a, button');
      const targetButton = Array.from(buttons).find(
        (button) =>
          button.textContent.toLowerCase().replace(/ /g, '').includes(buttonText.toLowerCase())
      );
  
      if (targetButton) {
        console.log(targetButton);
        targetButton.click();
      } else {
        console.log("Hey!!!!");
        console.log(`The "${buttonText}" button was not found or does not have the expected text.`);
      }
    }, buttonText);
    
  }
module.exports={GoInstagram,handleDialogBox};