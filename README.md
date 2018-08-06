# react-first-matching-node

## Manager

**Props**

| Prop   | Type     | Description                                                                                                                |
| ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| name   | String   | namespace for the Manager.  Targets will register themselves against this namespace.                                       |
| active | Boolean  | When this is true, the Manager will run a check to find the first Target and fire the registered callback for that Target. |
| ids    | String[] | Which Target IDs should be considered when checking for the first target                                                   |  |
    

## Target

**Props**

| Prop     | Type     | Description                                                                                                                                                                                            |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id       | String   | ID for the target.  Needs to be unique                                                                                                                                                                 |
| children | Function | A function that returns a React node.  It is passed a single parameter of type TargetNodeProps, which are the props that should be spread onto your target HTML node, for example your containing div. |
| onMatch  | Function | A function that is called when this target is the first matching node.  It is called with a reference to the DOM node that TargetNodeProps were applied to                                             |