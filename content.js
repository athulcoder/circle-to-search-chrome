(function () {
  // Create overlay
  let overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.3)";
  overlay.style.zIndex = "999999";
  overlay.style.cursor = "crosshair";
  document.body.appendChild(overlay);

  let startX, startY, endX, endY;
  let selection = document.createElement("div");
  selection.style.position = "absolute";
  selection.style.border = "2px dashed #fff";
  selection.style.borderRadius = "50%"; // makes it circular
  selection.style.pointerEvents = "none";
  overlay.appendChild(selection);

  // Mouse down = start circle
  overlay.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    selection.style.left = startX + "px";
    selection.style.top = startY + "px";
    selection.style.width = "0px";
    selection.style.height = "0px";
  });

  // Mouse move = update circle
  overlay.addEventListener("mousemove", (e) => {
    if (startX !== undefined) {
      endX = e.clientX;
      endY = e.clientY;
      let w = endX - startX;
      let h = endY - startY;
      let size = Math.max(Math.abs(w), Math.abs(h)); // make it a circle
      selection.style.width = size + "px";
      selection.style.height = size + "px";
      selection.style.left = Math.min(startX, endX) + "px";
      selection.style.top = Math.min(startY, endY) + "px";
    }
  });

  // Mouse up = finish selection
  overlay.addEventListener("mouseup", () => {
    overlay.remove();

    chrome.runtime.sendMessage({
      type: "capture",
      coords: {
        x: parseInt(selection.style.left),
        y: parseInt(selection.style.top),
        w: parseInt(selection.style.width),
        h: parseInt(selection.style.height),
      },
    });
  });
})();
