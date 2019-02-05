import * as React from 'react';

const uid = () =>
  `${Math.random()
    .toString(32)
    .substr(2, 8)}`;

const Context = React.createContext<NodeManagerContext | null>(null);

type HTMLElementMap = { [key: string]: HTMLElement };

export interface NodeManagerContext {
  nodes: HTMLElementMap;
  register: (key: string, node: HTMLElement) => void;
  unregister: (key: string) => void;
  namespace: string;
}

export interface NodeManagerProps {
  children: React.ReactNode;
}

export const NodeManager: React.FC<NodeManagerProps> = ({ children }) => {
  const [nodes, setNodes] = React.useState<HTMLElementMap>({});
  const namespace = React.useRef(uid());
  const register = React.useCallback<NodeManagerContext['register']>(
    (key, node) => {
      setNodes(n => ({ ...n, [key]: node }));
    },
    []
  );

  const unregister = React.useCallback<NodeManagerContext['unregister']>(
    key => {
      setNodes(n => {
        const { [key]: omitted, ...rest } = n;

        return rest;
      });
    },
    []
  );

  const context = React.useMemo(
    () => {
      return {
        namespace: namespace.current,
        nodes,
        register,
        unregister,
      };
    },
    [nodes, register, unregister, namespace]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

// sort an array of DOM nodes according to the HTML tree order
// http://www.w3.org/TR/html5/infrastructure.html#tree-order
function sortNodes(nodes: HTMLElement[]) {
  return nodes.sort(function(a: HTMLElement, b: HTMLElement) {
    var posCompare = a.compareDocumentPosition(b);

    if (posCompare & 4 || posCompare & 16) {
      // a < b
      return -1;
    } else if (posCompare & 2 || posCompare & 8) {
      // a > b
      return 1;
    } else if (posCompare & 1 || posCompare & 32) {
      throw 'Cannot sort the given nodes.';
    } else {
      return 0;
    }
  });
}

// returns nodes in DOM order
export function useOrderedNodes(sorter = sortNodes) {
  const [matches, setMatches] = React.useState<HTMLElement[]>([]);
  const { nodes, namespace } = React.useContext(Context);

  React.useLayoutEffect(
    () => {
      const sorted = sorter(Object.keys(nodes).map(k => nodes[k]));
      setMatches(sorted);
    },
    [nodes, namespace]
  );

  return matches;
}

// returns a map of node IDs to nodes
export function useNodes() {
  const { nodes } = React.useContext(Context);
  return nodes;
}

export function useRegisteredRef(key: string) {
  const ref = React.useRef<HTMLElement | undefined>(undefined);

  const { register, unregister } = React.useContext(Context);

  React.useEffect(
    () => {
      if (ref.current) {
        register(key, ref.current);
      } else {
        // if ref.current is undefined, we want to unregister the ref
        unregister(key);
      }
      // unregister on unmount
      return () => unregister(key);
    },
    [ref.current, key]
  );

  return ref;
}
