const puppeteer = require("puppeteer");
const https = require("https");
const fs = require("fs");

const path = require("path");

//download posts
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const downloadDir = path.join(__dirname, "seeders");
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

const download = (url, filename) => {
  https.get(url, (res) => {
      const writeStream = fs.createWriteStream(filename);
      res.pipe(writeStream);

      writeStream.on("finish", () => {
        writeStream.close();
        console.log(`Downloaded: ${filename}`);
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading ${url}: ${err.message}`);
    });
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    protocolTimeout: 120000000,
  });

  const page = await browser.newPage();
  await page.goto("https://www.instagram.com");

  await page.waitForSelector('input[name="username"]');
  await page.waitForSelector('input[name="password"]');
  await page.waitForSelector('button[type="submit"]');

    await page.type('input[name="username"]', 'ravi.sinhmar.28'); // Adjust delay if needed
    await page.type('input[name="password"]', 'sidhubai$$295Legand');

  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle0" }); // Wait for the page to load after login

  await page.goto("");

  const links = "._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6";
  await page.waitForSelector(links);
  await page.evaluate(() => {
    const istLink = document.querySelector(
      "._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6>div>a"
    );
    if (istLink) {
      istLink.click();
    }
  });

  await delay(20);
  await page.waitForSelector(
    ".x1qjc9v5.x9f619.x78zum5.x1q0g3np.xln7xf2.xk390pu.x5yr21d.x1n2onr6.x11njtxf"
  );

  await delay(1000);
  const imageUrls = await page.evaluate(() => {
    let img = document.querySelectorAll(
      ".x1qjc9v5.x9f619.x78zum5.x1q0g3np.xln7xf2.xk390pu.x5yr21d.x1n2onr6.x11njtxf"
    );
    let i = img[1].querySelectorAll("img");

    return Array.from(i).map((img) => img.src);
  });

  for (const [index, url] of imageUrls.entries()) {
    const filename = path.join(`downloadDir, image-${Date.now()}.jpg`);
    await delay(500);
  }

  //for videos

  // delay(1000);
  // const video="article video";
  // await page.waitForSelector(video);

  // const videoUrl = await page.evaluate(() => {
  //     const videoElement = document.querySelector('article video'); // Adjust selector as needed
  //     return videoElement ? videoElement.src : null;
  // });
  // if (videoUrl) {
  //     const filename = path.join(downloadDir, video-${Date.now()}.mp4); // Use a timestamp for uniqueness
  //     download(videoUrl, filename);
  // } else {
  //     console.error('No video URL found.');
  // }
})();
