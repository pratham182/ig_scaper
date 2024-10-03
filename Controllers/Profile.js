// Getting Users Bio/Profile Details
const profile = async (username, page) => {
  try {
    await page.goto(`https://www.instagram.com/${username}/`);
    let main = await page.waitForSelector('[role="main"]');

    let dataFromMain = await main.evaluate(async (main) => {
      let user_name = null;
      let type = null;
      while (true) {
        let sorry = main.textContent.trim().toLowerCase().includes("sorry");
        let available = main.textContent
          .trim()
          .toLowerCase()
          .includes("available");
        if (sorry && available) {
          type = "404";
          break;
        } else {
          let svg = main.querySelector('svg[aria-label="Posts"]');
          if (!svg) {
            type = "Private";
            break;
          } else if(svg) {
            type = "Public";
            break;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      if(type === '404'){
        return {status:'fail', type:'404',content:'Please Provide a Valid Username'}
      }
      if(type === 'Private'){
        return {status:'fail', type:'Private',content:'Account is Private , so can not access the data'}
      }
      if(type === 'Public'){
        user_name = main.querySelectorAll("section")[3].querySelector("span").innerText;
        if(user_name){
          return {status:'success', type:'Public',content:user_name}
        }
      }
    });
    return dataFromMain;
  } catch (error) {
    console.log(error);
    return {status:'fail',type:'500',content:error}
  }

};
module.exports = profile;
