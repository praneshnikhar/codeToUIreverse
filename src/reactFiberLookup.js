/**
 * Given a DOM Node selected via the click,
 * traverse React Fiber tree to find matching Fiber node's debug source info.
 * @param {Element} domNode
 * @returns {{ fileName: string, lineNumber: number, columnNumber: number } | null}
 */
function getReactFiberForNode(domNode) {
    if (!domNode) return null;
  
    // Walk up the DOM tree to find a React root container with _reactRootContainer property
    let rootContainer = domNode;
    while (rootContainer && !rootContainer._reactRootContainer) {
      rootContainer = rootContainer.parentNode;
    }
    if (!rootContainer || !rootContainer._reactRootContainer) {
      return null;
    }
  
    const rootFiber = rootContainer._reactRootContainer._internalRoot.current;
  
    // Recursive traverse fiber tree to find fiber with stateNode === domNode and debug source info
    function traverse(fiber) {
      if (!fiber) return null;
  
      if (fiber.stateNode === domNode && fiber._debugSource) {
        return fiber._debugSource; // { fileName, lineNumber, columnNumber }
      }
      let res = traverse(fiber.child);
      if (res) return res;
      return traverse(fiber.sibling);
    }
  
    return traverse(rootFiber);
  }
  