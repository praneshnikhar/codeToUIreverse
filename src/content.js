
document.addEventListener(
  "click",
  (event) => {
    if (!(event.ctrlKey && event.shiftKey)) return;

    event.preventDefault();

    const el = event.target;
    el.style.outline = "2px solid #f00";

    chrome.runtime.sendMessage({ type: "ELEMENT_CLICK" });
  },
  true
);
