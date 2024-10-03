const isUserLoggedIn = async (page) => {
  let isLoggedIn = false;
    let tries = 0;
    while (tries < 4) {
      tries++;
      const sp = await page.evaluate(() => {
        const svg = document.querySelector('svg[aria-label="Explore"]');
        return svg !== null;
      });
  
      if (sp) {
        isLoggedIn = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return isLoggedIn;
  };
  
module.exports=isUserLoggedIn;