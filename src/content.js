
document.addEventListener(
  "click",
  (event) => {
    if (!(event.ctrlKey && event.shiftKey)) return;

    event.preventDefault();

    const el = event.target;
    el.style.outline = "2px solid #f00";

    // Send a message to background.js with some necessary info.
    // We cannot pass DOM nodes directly via messaging; instead, identify element with a selector or index.
    // For demo, we'll send a unique attribute or just let background script query active element.

    // Simplest approach: send a message that the user clicked, then background script runs logic inside the page context.

    chrome.runtime.sendMessage({ type: "ELEMENT_CLICK" });
  },
  true
);
