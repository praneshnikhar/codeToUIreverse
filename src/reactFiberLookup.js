
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
  
