# react-register-nodes

Register a set of refs within a context.  Helpful for UI where many siblings need to know about each other.  Shared example is scrolling to the first error in a form submission.

## API Reference

### `<NodeManager/>`

Sets up context.  Must be above any components that call the `use*` hooks.

### `useRegisteredRef(key: string): HTMLElement | undefined`

Returns a `ref`.  The node assigned to `ref.current` will be registered with the nearest NodeManager. Accepts an id to serve as the key to register the node under.

### `useOrderedNodes(sorter: (nodes: HTMLElement[]) => HTMLElement[]): HTMLElement[]`

Returns all registered nodes in the order specified by . Uses [DOM order](https://gist.github.com/Justineo/ec7275cda82e986fc47b) by default.

### `useNodes(): { [key: string]: HTMLElement }`

Returns a map of ids to nodes.

# Example

https://codesandbox.io/s/10363x25oq

```js
import * as React from "react";
import { render } from "react-dom";
import smoothScrollIntoView from "smooth-scroll-into-view-if-needed";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  NodeManager,
  useNodes,
  useOrderedNodes,
  useRegisteredRef
} from "react-register-nodes";

import "./styles.css";

const FieldSet = ({ name, label, style, ...rest }) => {
  const ref = useRegisteredRef(name);

  return (
    <Field name={name}>
      {({ field, form: { errors, touched } }) => {
        const error = touched[name] && errors[name];

        return (
          <div ref={error && ref} style={{ marginBottom: "1rem", ...style }}>
            <label htmlFor={name}>{label}</label>
            <input
              {...field}
              id={name}
              name={name}
              {...rest}
              style={{ width: "100%" }}
            />
            {error && (
              <div
                style={{
                  marginTop: ".5rem",
                  display: "inline-block",
                  borderRadius: 5,
                  color: "#DE3A11",
                  background: "#FFE3E3",
                  padding: ".5rem 1rem"
                }}
              >
                {error}
              </div>
            )}
          </div>
        );
      }}
    </Field>
  );
};

const schema = Yup.object().shape({
  username: Yup.string()
    .min(5, "Must be at least 5 characters")
    .required("Required.")
});
const values = {
  username: ""
};

const ExampleForm = () => {
  // Gives us an array of all registered nodes sorted in Document Order.
  const ordered = useOrderedNodes();

  const [shouldCheckForScroll, setShouldCheckForScroll] = React.useState(false);

  React.useEffect(
    () => {
      if (shouldCheckForScroll && ordered.length > 0) {
        smoothScrollIntoView(ordered[0], {
          scrollMode: "if-needed",
          block: "center",
          inline: "start"
        }).then(() => {
          ordered[0].querySelector("input").focus();
          setShouldCheckForScroll(false);
        });
      }
    },
    [shouldCheckForScroll, ordered]
  );

  return (
    <Formik
      initialValues={values}
      validationSchema={schema}
      onSubmit={() => {
        console.log("submitted");
      }}
    >
      {({ handleSubmit, values }) => {
        return (
          <form
            onSubmit={e => {
              setShouldCheckForScroll(true);
              handleSubmit(e);
            }}
            className="pure-form pure-form-stacked"
          >
            <fieldset>
              <legend>The Longest Form of Them All</legend>
              <p>Woah! What a long form that will scroll nicely</p>
              <div
                style={{
                  marginBottom: "100vh"
                }}
              >
                <FieldSet
                  name="username"
                  label="Username"
                  placeholder={`Enter at least 5 characters`}
                />
              </div>
              <button type="submit" className="pure-button pure-button-primary">
                Go
              </button>
            </fieldset>
          </form>
        );
      }}
    </Formik>
  );
};

const rootElement = document.getElementById("root");
render(
  <div id="app">
    <NodeManager namespace="example">
      <ExampleForm />
    </NodeManager>
  </div>,

  rootElement
);
```
