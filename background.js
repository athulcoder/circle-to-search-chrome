chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "capture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
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
        newTab.document.write(`
          <html>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;">
              <img src="${cropped}" style="border-radius:50%;max-width:90%;max-height:90%;">
              <p style="color:#fff;text-align:center;">Right-click the image → Search Google for this image</p>
            </body>
          </html>
        `);
      };
    });
  }
});
