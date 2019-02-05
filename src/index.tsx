import * as React from 'react';

const uid = (prefix: string) =>
  `${prefix}-${Math.random()
    .toString(32)
    .substr(2, 8)}`;

function usePrevious<T>(value: T) {
  const ref = React.useRef<T | undefined>(undefined);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Context = React.createContext<NodeManagerContext | null>(null);

export interface NodeManagerContext {
  matches: HTMLElement[];
  register: (node: HTMLElement) => void;
  unregister: (node: HTMLElement) => void;
}

export const NodeManager = ({ namespace, children }) => {
  const [refs, setRefs] = React.useState<HTMLElement[]>([]);
  const [matches, setMatches] = React.useState<HTMLElement[]>([]);

  const register = React.useCallback<NodeManagerContext['register']>(ref => {
    setRefs(r => [...r, ref]);

    ref.dataset.fmcId = uid(`fmc-${namespace}`);
  }, []);

  const unregister = React.useCallback<NodeManagerContext['unregister']>(
    ref => {
      setRefs(r => r.filter(r => r !== ref));
    },
    []
  );

  React.useLayoutEffect(
    () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        `[data-fmc-id^="fmc-${namespace}"]`
      )!;

      setMatches(
        [...((nodes as unknown) as HTMLElement[])]
          .map(node => {
            // map nodes back into refs to keep reference integrity.
            const ref = refs.find(r => {
              return node.isSameNode(r);
            });
            return ref;
          })
          .filter(r => !!r) // filter falsy nodes
      );
    },
    [refs, namespace]
  );

  const context = React.useMemo(
    () => {
      return {
        matches,
        register,
        unregister,
      };
    },
    [matches, register, unregister]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export function useRegisteredNodes() {
  const { matches } = React.useContext(Context);

  return matches;
}

export function useRegisteredRef() {
  const ref = React.useRef<HTMLElement | undefined>(undefined);

  const { register, unregister } = React.useContext(Context);
  const previousRef = usePrevious(ref.current);

  React.useEffect(
    () => {
      if (ref.current) {
        register(ref.current);
      } else {
        // if ref.current is undefined, we want to unregister the ref
        unregister(previousRef);
      }
      // unregister on unmount
      return () => unregister(previousRef);
    },
    [ref.current]
  );

  return ref;
}
