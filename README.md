# react-register-nodes

Register a set of refs within a context.  Helpful for UI where many siblings need to know about each other.  Shared example is scrolling to the first error in a form submission.

## NodeManager

Sets up context.  Must be above any components that call the `use*` hooks.

## useRegisteredRef

Returns a ref that will be registered with the nearest NodeManager.

## useRegisteredNodes

Returns all registered nodes in the order that they appear in the DOM.

# Example

https://codesandbox.io/s/10363x25oq