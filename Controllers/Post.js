// // Getting the Posts by User (Photos Only)
// const post = async (username, page) => {
//     await page.goto(`https://www.instagram.com/muskanyadav__15/`);
//     let main = await page.waitForSelector("main");
//     const header = await page.waitForSelector("header");
//     main = await main.evaluate(async (main) => {
//         const mainF = document.querySelector('main');
//         const header = mainF.querySelector('header');
//         let hLinks = header.querySelectorAll('a:has(img)');
//         let mLinks = main.querySelectorAll('a:has(img)');
//         const allPosts = new Set();
//         let three = 0;
//         let sheight = 0;
//         function delay(ms) {
//           return new Promise(resolve => setTimeout(resolve, ms));
//         }
        
//         async function scrollWithDelay() {
//           while (true) {
//             mLinks = mainF.querySelectorAll('a:has(img)');
//             hLinks = header.querySelectorAll('a:has(img)');
//               let currentCount = mLinks.length - hLinks.length;
              
//             if (three === 100) {
//               break;
//             }
        
//            // console.log(currentCount)
//          let prevSize = allPosts.size;
//             for (let i = 0; i <currentCount; i++) {
//               let postAnc = mLinks[hLinks.length  + i];
//               let postHref = postAnc.getAttribute('href');
//               let postImage = postAnc.querySelector('img');
//               sheight = postImage.clientHeight;
//               let postSrc = postImage.getAttribute('src');
              
//               let data = {
//                 postHref: postHref,
//                 postSrc: postSrc
//               };
             
//               allPosts.add(JSON.stringify(data));
//             //   console.log(allPosts);
//             }
//                let currSize = allPosts.size;
//                if (currSize > prevSize) {
//         let diff = currSize - prevSize;
                 
//               window.scrollBy(0, sheight * currentCount/3);
//         three = 0;
//             }
//             if(currSize === prevSize){
//                 three++;
//             }
//             // Add a delay between scrolls
//             await delay(100); // 1000ms = 1 second delay

//           }
//           console.log(allPosts);


//         return allPosts;
//         };
        
       
//     // Call the async function
//     return scrollWithDelay().catch(console.error);
//     });



//     // await page.goto(`https://www.instagram.com${main}`);
//     // let pst = await page.waitForSelector("main");
//     // pst = await pst.evaluate(async (post) => {
//     //     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//     //     let totalCount = 0;
//     //     let videoCount = 0;
//     //     let imageCount = 0;
//     //     const postLinks = new Set();
//     //      // Function to download video from a Blob URL in the Puppeteer context
//     //     while (true) {
//     //         const mediaElements = post.querySelectorAll("video, img");
//     //         for (const element of mediaElements) {
//     //             let src = element.getAttribute("src");
//     //             if (element.tagName === "IMG") {
//     //                 let altText = element.getAttribute('alt').toLowerCase().replace(/\s+/g, '');
//     //                 let containsPhotoBy = altText.includes('photoby');
//     //                 if(containsPhotoBy){
//     //                     if (!postLinks.has(src)) {
//     //                         postLinks.add(JSON.stringify({ type: "Image", src: src }));
//     //                         imageCount++;
//     //                         totalCount++;
//     //                     }
//     //                 }
//     //             } else if (element.tagName === "VIDEO" && element.hasAttribute('playsinline')) {
//     //                 if (!postLinks.has(src)) {
//     //                     postLinks.add(JSON.stringify({ type: "Video", src: src }));
//     //                     videoCount++;
//     //                     totalCount++;
//     //                 }
//     //             }
//     //         }

//     //         let next = post.querySelector('button[aria-label="Next"]');
//     //         if (!next) {
//     //             break;
//     //         } else {
//     //             next.click();
//     //             await delay(1000); // Wait for the next page to load
//     //         }
//     //     }

//     //     console.log(Array.from(postLinks)); // Log the collected posts
//     //     return Array.from(postLinks);
//     // });
//     // console.log(pst); // Log final post links
//     // return pst;
   

//     return main;
// };

// module.exports = post;



const post = async (username, page) => {

    try{
        await page.goto(`https://www.instagram.com/${username}`);
    
    let main = await page.waitForSelector('main');
    await page.waitForSelector('header');

    // Evaluate the scrolling and collecting function in the page context
    const allPosts = await main.evaluate(async () => {
        const mainF = document.querySelector('main');
        const header = mainF.querySelector('header');
        let hLinks = header.querySelectorAll('a:has(img)');
        let mLinks = mainF.querySelectorAll('a:has(img)');
        const allPosts = new Set();
        let three = 0;
        let sheight = 0;

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function scrollWithDelay() {
            while (true) {
                mLinks = mainF.querySelectorAll('a:has(img)');
                hLinks = header.querySelectorAll('a:has(img)');
                let currentCount = mLinks.length - hLinks.length;

                if (allPosts.size >= 8) {
                    break;
                }

                let prevSize = allPosts.size;
                for (let i = 0; i < currentCount; i++) {
                    let postAnc = mLinks[hLinks.length + i];
                    let postHref = postAnc.getAttribute('href');
                    let postImage = postAnc.querySelector('img');
                    sheight = postImage.clientHeight;
                    let postSrc = postImage.getAttribute('src');
                    let data = {
                        postHref: postHref,
                        postSrc: postSrc
                    };
                    allPosts.add(JSON.stringify(data));
                    await delay(10);
                }
                let currSize = allPosts.size;
                if (currSize > prevSize) {
                    let diff = currSize - prevSize;
                    window.scrollBy(0, sheight * currentCount / 2);
                    three = 0;
                }
                if (currSize === prevSize) {
                    three++;
                }

                // Add a delay between scrolls
                await delay(500); // 100 ms delay
                console.log("allPost",allPosts.size);
                console.log("three",three);
                console.log("currentcount",currentCount);
            }

            return Array.from(allPosts); // Convert Set to an array before returning
        }

        // Call the async function
        return scrollWithDelay().catch(console.error);
    });

    // console.log(Array.from(allPosts)); // Log the collected posts
    return Array.from(allPosts);

    }
    catch(err){
        console.log(err);
        return {status:"fail",message:err};
    }
    
};

module.exports = post;

