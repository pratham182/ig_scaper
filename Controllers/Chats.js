const chats = async(username,name,page)=>{
  async function handleDialogBox(page, buttonText) {
    await page.evaluate((buttonText) => {
      const buttons = document.querySelectorAll('div[role="button"], a, button');
      const targetButton = Array.from(buttons).find(
        (button) =>
          button.textContent.toLowerCase().replace(/ /g, '').includes(buttonText.toLowerCase())
      );
  
      if (targetButton) {
        targetButton.click();
      } else {
        console.log(
          `The "${buttonText}" button was not found or does not have the expected text.`
        );
      }
    }, buttonText);
  }
    await page.goto("https://www.instagram.com/direct/inbox/");
    handleDialogBox(page,'notnow');
    const frScroll = await page.waitForSelector(".x1rife3k");
    await frScroll.evaluate((fr) => {
      fr.querySelectorAll('div[role="button"]')[2].click();
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const secondElement = await page.waitForFunction(() => {
      const elements = document.querySelectorAll(".x1rife3k");
      return elements.length > 1; // Check if at least two elements are present
    });
    // Targeting Friends List and Specific Friend's Chats List to scroll
    const secondElementHandle = await page.$$(".x1rife3k");
    let friendData = await page.waitForSelector('div[role="main"]');
    friendData = await friendData.evaluate((elm) => {
      let fId = elm.querySelector("a").getAttribute("href").split("/")[1];
      let fName = elm.innerText.split("\n")[0].toLowerCase().replace(/\s+/g, "");
      console.log(fId, fName);
      return [fId, fName];
    });
    console.log(friendData);
    const chatBox = await secondElementHandle[1].evaluate((elm) => {
      const chatScroll = elm;
      const allChats = elm.children[2].children[0].children;
      let totalChild = 0;
      let count = 0;
      let ReelPathAtb_d =
          "m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z";
        let PostPathAtb_d =
          "M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z";
      const mySet = new Set();
  
      // Delay function
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      async function extractChats() {
          totalChild = 0;
           while (true) {
          let prevScrollTop = chatScroll.scrollTop;
          currentLength = allChats.length;
          let clientHeight = 0;
          for (let i = currentLength - 2 - totalChild; i >= 0; i--) {
            if (allChats[i].innerText !== "") {
              totalChild++;
              let toAdd = allChats[i].innerText;
              toAdd = toAdd.split("\n");
              // Audio/Video call type checking
              if (!allChats[i].querySelector('div[role="button"]')) {
                if (
                  allChats[i].innerText.toLowerCase().includes("ended") &&
                  allChats[i].innerText.toLowerCase().includes("audio")
                ) {
                  toAdd.push("AudioCallEnd");
                } else if (
                  allChats[i].innerText.toLowerCase().includes("ended") &&
                  allChats[i].innerText.toLowerCase().includes("video")
                ) {
                  toAdd.push("VideoCallEnd");
                }
                if (
                  allChats[i].innerText.toLowerCase().includes("missed") &&
                  allChats[i].innerText.toLowerCase().includes("audio")
                ) {
                  toAdd.push("AudioCallMis");
                } else if (
                  allChats[i].innerText.toLowerCase().includes("missed") &&
                  allChats[i].innerText.toLowerCase().includes("video")
                ) {
                  toAdd.push("VideoCallMis");
                } else if (
                  allChats[i].innerText.toLowerCase().includes("started") &&
                  allChats[i].innerText.toLowerCase().includes("audio")
                ) {
                  toAdd.push("AudioCallStart");
                } else if (
                  allChats[i].innerText.toLowerCase().includes("started") &&
                  allChats[i].innerText.toLowerCase().includes("video")
                ) {
                  toAdd.push("VideoCallStart");
                }
              }
              // Link type checking
              else if (allChats[i].querySelector('a[target="_blank"]')) {
                toAdd.push("Link");
                let hrf = allChats[i].querySelector("a").getAttribute("href");
                toAdd.push(hrf);
              }
  
              // Link type checking
              else if (allChats[i].querySelector('a[target="_self"]')) {
                toAdd.push("Profile");
                let hrf = allChats[i]
                  .querySelector("a")
                  .getAttribute("href")
                  .split("/")[1];
                toAdd.push(hrf);
              }
              // Reel type checking
              else if (allChats[i].querySelector(`path[d="${ReelPathAtb_d}"]`)) {
                toAdd.push("Reel");
                toAdd.push("Reel Link");
              }

              // Post type checking
              else if (allChats[i].querySelector(`path[d="${PostPathAtb_d}"]`)) {
                toAdd.push("Post");
                toAdd.push("Post Link");
              }
  
              // Image type checking
              else if (allChats[i].querySelector('img[alt="Open photo"]')) {
                toAdd.push("Image");
                let sr = allChats[i]
                  .querySelector('img[alt="Open photo"]')
                  .getAttribute("src");
                toAdd.push(sr);
              }
  
              // Video type checking
              else if (allChats[i].querySelector('img[alt="Open Video"]')) {
                toAdd.push("Video");
                let sr = allChats[i]
                  .querySelector('img[alt="Open Video"]')
                  .getAttribute("src");
                toAdd.push(sr);
              }
  
              // Audio type checking
              else if (allChats[i].querySelector('div[aria-label="Play"]')) {
                toAdd.push("Audio");
                toAdd.push("Audio Link");
              } else if (allChats[i].querySelector('div[aria-label="Video"]')) {
                toAdd.push("CamVideo");
                toAdd.push("CamVideo Link");
              } else if (allChats[i].querySelectorAll("img").length) {
                let emoji = "";
                for (
                  let j = 0;
                  j < allChats[i].querySelectorAll("img").length;
                  j++
                ) {
                  emoji = `${emoji}${allChats[i]
                    .querySelectorAll("img")
                    [j].getAttribute("alt")}`;
                }
                toAdd.push("TextEmoji");
                toAdd.push(emoji);
              } else {
                toAdd.push("TextChat");
                toAdd.push("Data");
              }
  
              mySet.add(toAdd); // Use 'toAdd' instead of 'allChats.innerText'
              clientHeight += allChats[i].clientHeight;
            }
            await delay(10); // 200 ms delay for each iteration of the for loop
          }
          chatScroll.scrollTop = chatScroll.scrollTop - clientHeight;
          let currentScrollTop = chatScroll.scrollTop;
          if (prevScrollTop == currentScrollTop && allChats.length == mySet.size + 1) {
            count++;
          } else {
            count = 0;
          }
  
          if (count > 200) {
            break;
          }
          await delay(20); // 20 ms delay for each iteration of the while loop
        }
  
        return Array.from(mySet);
      }
      // Call the async function
      return extractChats();
    });

       let call = false;
      const chatData = chatBox.map((chat, index) => {
      let senderName = "";
      let senderId = "";
      let contentType = "";
      let content = "";
      let contentNext = "";
      let time = "";
      let receiverName = "";
      let receiverId = "";
      let nameLower = friendData[1].replace(/\s+/g, "").trim().toLowerCase();
      let idLower = friendData[0].trim().toLowerCase();
      let chatLength = chat.length;
      let type = chat[chat.length - 1].toLowerCase().trim();
      if (call) {
        if (chat[0].toLowerCase().trim().includes("you")) {
          senderName = name;
          senderId = username;
          receiverName = nameLower;
          receiverId = idLower;
          contentType = chat[chatLength - 1];
          content = chat[0];
          contentNext = chat[0];
        } else if (
          chat[0].toLowerCase().trim().includes(idLower) ||
          chat[0].toLowerCase().trim().includes(nameLower)
        ) {
          senderName = nameLower;
          senderId = idLower;
          receiverName = name;
          receiverId = username;
          contentType = chat[chatLength - 1];
          content = chat[0];
          contentNext = chat[0];
        }
      }
      if (type == "audiocallend") {
        call = true;
        senderName = "AudioCallEnded";
        senderId = "AudioCallEnded";
        receiverName = "AudioCallEnded";
        receiverId = "AudioCallEnded";
        contentType = "AudioCallEnded";
        content = chat[0];
        contentNext = chat[0];
      } else if (type == "videocallend") {
        call = true;
        senderName = "VideoCallEnded";
        senderId = "VideoCallEnded";
        receiverName = "VideoCallEnded";
        receiverId = "VideoCallEnded";
        contentType = "VideoCallEnded";
        content = chat[0];
        contentNext = chat[0];
      }
      if (type == "audiocallmis") {
        call = true;
        senderName = "AudioCallMissed";
        senderId = "AudioCallMissed";
        receiverName = "AudioCallMissed";
        receiverId = "AudioCallMissed";
        contentType = "AudioCallMissed";
        content = chat[0];
        contentNext = chat[0];
      } else if (type == "videocallmis") {
        call = true;
        senderName = "VideoCallMissed";
        senderId = "VideoCallMissed";
        receiverName = "VideoCallMissed";
        receiverId = "VideoCallMissed";
        contentType = "VideoCallMissed";
        content = chat[0];
        contentNext = chat[0];
      } else if (type == "audiocallstart") {
        call = false;
      } else if (type == "videocallstart") {
        call = false;
      } else {
        for (let i = 0; i <= chat.length - 1; i++) {
          let n = chat[i];
          n = n.replace(/\s+/g, "").trim(); // Replace all spaces with an empty string
          n = n.toLowerCase();
          if (n.includes("sent")) {
            senderName = name;
            senderId = username;
            receiverName = friendData[1];
            receiverId = friendData[0];
            if (i == 2) {
              time = chat[i - 1];
            } else {
              time = "Pervious Time";
            }
            contentType = chat[chat.length - 2];
            content = chat[i + 1];
            contentNext = chat[chat.length - 1];
          } else if (n.includes(nameLower) || n == nameLower) {
            senderName = friendData[1];
            senderId = friendData[0];
            receiverId = username;
            receiverName = name;
            if (i == 2) {
              time = chat[i - 1];
            } else {
              time = "Previous Time";
            }
            contentType = chat[chat.length - 2];
            if (chat[i] && chat.length != 1) {
              content = chat[i + 1];
              contentNext = chat[chat.length - 1];
            }
          }
        }
      }
      return {
        senderName: senderName,
        senderId: senderId,
        content: content,
        time: time,
        contentType: contentType,
        contentNext: contentNext,
        receiverName: receiverName,
        receiverId: receiverId,
      };
    });

    return chatData;
}

module.exports = chats;