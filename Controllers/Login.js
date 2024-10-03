
const login = async (username, password,page) => {
    // Wait for the article element
    // console.log("Hey");
    // const article = await page.waitForSelector('article');
  
    // Function to handle login
    // await article.evaluate(async (article) => {
    //   // Delay function
    //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    //   let count = 0;
    //   // while (true) {
    //   //   const allButtons = article.querySelectorAll('button , a');
    //   //   console.log('allButtons', allButtons);
        
    //   //   const loginLinks = Array.from(allButtons).filter(link => 
    //   //     link.textContent.toLowerCase().replace(" ", "").includes('login')
    //   //   );
  
    //   //   if (loginLinks.length > 0 || count > 10) {
    //   //     if (loginLinks.length > 0) {
    //   //       console.log("Login link found: ", loginLinks[0]);
    //   //       loginLinks[0].click(); // Click the login button
    //   //     }
    //   //     break;
    //   //   } 
  
    //   //   count++;
    //   //   await delay(500); // Await the delay
    //   // }
    // });

   await page.goto("https://www.instagram.com/accounts/login/?next=%2F&source=mobile_nav");
    // Wait for login input fields and submit button to be available
    await page.screenshot({ path: 'screenshot1.png', fullPage: true });

    await page.waitForSelector('input[name="username"]',{ visible: true, timeout: 5000 });
    await page.screenshot({ path: 'screenshot2.png', fullPage: true });

    await page.waitForSelector('input[name="password"]',{ visible: true, timeout: 5000 });
    await page.screenshot({ path: 'screenshot3.png', fullPage: true });

    await page.waitForSelector('button[type="submit"]',{ visible: true, timeout: 5000 });
  
    // Assign data and log in
    await page.screenshot({ path: 'screenshot4.png', fullPage: true });

    await page.type('input[name="username"]', username);
    
    await page.screenshot({ path: 'screenshot5.png', fullPage: true });

    await page.type('input[name="password"]', password);
    await page.screenshot({ path: 'screenshot6.png', fullPage: true });

    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'screenshot7.png', fullPage: true });

    return  true;
    
  };
  
  module.exports = login;
  