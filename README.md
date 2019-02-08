# react-register-nodes

Register a DOM nodes within a context.  Helpful for UI where many siblings need to know about each other. A common example is scrolling to the first error after a form submission.

## Installation

```
yarn add react-register-nodes
```

## API Reference

### `<NodeManager/>`

This is the Context Provider.  Must be above any components that call the `use*` hooks.

### `useRegisteredRef(key: string): HTMLElement | undefined`

Returns a `ref` to be passed to your DOM node.  The node assigned to `ref.current` will be registered with the nearest NodeManager. Accepts an id to serve as the key to register the node under. 

### `useNodes(): { [key: string]: HTMLElement }`

Returns an object of all registered nodes. Nodes are keyed by the key you passed to `useRegisteredRef`.

### `useOrderedNodes(sorter: (nodes: HTMLElement[]) => HTMLElement[]): HTMLElement[]`

Returns all registered nodes in the order specified by `sorter`. Uses [DOM order](https://gist.github.com/Justineo/ec7275cda82e986fc47b) by default.


## Usage


```js
import * as React from "react";
import { render } from "react-dom";
import {
  NodeManager,
  useNodes,
  useRegisteredRef
} from "react-register-nodes";


const Example = () => {
  // useRegisteredRef will return a ref to be used on the DOM node you'd like
  // to register. It accepts a string key to register the node under.
  const ref = useRegisteredRef("shallow");

  // useNodes will return an object containing any DOM nodes we have assigned our refs to
  // in this case, our div will be mapped to the key 'shallow'
  const nodes = useNodes();

  return (
    <React.Fragment>
      <div ref={ref}>
        Register Me!
      </div>

      <div>
        Registered Nodes:
        <pre>{JSON.stringify(Object.keys(nodes), null, 2)}</pre>
      </div>
    </React.Fragment>
  );
};

const rootElement = document.getElementById("root");
render(
  <div id="app">
    <NodeManager>
      <Example />
    </NodeManager>
  </div>,
  rootElement
);
```

## Examples

* Scroll to first error - https://codesandbox.io/s/10363x25oq
* Deep nested node registration - https://codesandbox.io/s/lxrno4nk9
