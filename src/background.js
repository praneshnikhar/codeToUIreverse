import { fetchSourceMapUrl } from "./utils/mapLogic/fetchSourceMap.js";
import { resolveOriginalPosition } from "./utils/mapLogic/resolveOriginal.js";
import { makeGithubUrl } from "./utils/githubLink.js";

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type !== "ELEMENT_CLICK") return;

  if (!sender.tab || !sender.tab.id) return;

  const tabId = sender.tab.id;

  try {
  

    const fiberInfo = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        
        function getReactFiberForNode(domNode) {
          if (!domNode) return null;

          let rootContainer = domNode;
          while (rootContainer && !rootContainer._reactRootContainer) {
            rootContainer = rootContainer.parentNode;
          }
          if (!rootContainer || !rootContainer._reactRootContainer) {
            return null;
          }

          const rootFiber = rootContainer._reactRootContainer._internalRoot.current;

          function traverse(fiber) {
            if (!fiber) return null;

            if (fiber.stateNode === domNode && fiber._debugSource) {
              return fiber._debugSource;
            }
            let res = traverse(fiber.child);
            if (res) return res;
            return traverse(fiber.sibling);
          }

          return traverse(rootFiber);
        }

       
        const el = document.activeElement || document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        return getReactFiberForNode(el);
      },
    });

    if (!fiberInfo || !fiberInfo[0] || !fiberInfo[0].result) {
      console.log("[ReverseLookup] No React Fiber debug source found.");
      return;
    }

    const { fileName, lineNumber, columnNumber } = fiberInfo[0].result;
    if (!fileName || !lineNumber || !columnNumber) {
      console.log("[ReverseLookup] Debug source missing fields.");
      return;
    }

    
    const pageUrl = sender.tab.url;
    const sourceMapUrl = await fetchSourceMapUrl(pageUrl);
    const response = await fetch(sourceMapUrl);
    const rawSourceMap = await response.json();

    
    const originalPos = resolveOriginalPosition(rawSourceMap, {
      line: lineNumber,
      column: columnNumber,
    });

    if (!originalPos || !originalPos.source || !originalPos.line) {
      console.log("[ReverseLookup] Original position not found in source map.");
      return;
    }

    
    const githubUrl = makeGithubUrl(originalPos.source, originalPos.line);

    chrome.tabs.create({ url: githubUrl });
  } catch (err) {
    console.error("[ReverseLookup] Error processing click:", err);
  }
});
