# react-register-nodes

Register a set of refs within a context.  Helpful for UI where many siblings need to know about each other.  Shared example is scrolling to the first error in a form submission.

## NodeManager

Sets up context.  Must be above any components that call the `use*` hooks.

## `useRegisteredRef`

Returns a ref.  The node assigned to `ref.current` will be registered with the nearest NodeManager. Accepts an id to serve as the key to register the node under.

## `useOrderedNodes(sorter: (nodes: HTMLElement[]) => HTMLElement[])`

Returns all registered nodes in the order specified by . Uses [DOM order](https://gist.github.com/Justineo/ec7275cda82e986fc47b) by default.


## `useNodes`

Returns a map of 

# Example

https://codesandbox.io/s/10363x25oq
