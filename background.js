chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      // Create a canvas to crop
      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = msg.coords.w;
        canvas.height = msg.coords.h;
        let ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          msg.coords.x,
          msg.coords.y,
          msg.coords.w,
          msg.coords.h,
          0,
          0,
          msg.coords.w,
          msg.coords.h
        );

        let cropped = canvas.toDataURL("image/png");

        // Open cropped image in a new tab
        let newTab = window.open();
        newTab.document.write(
          `<img src="${cropped}" style="border-radius:50%;">`
        );
      };
    });
  }
});
