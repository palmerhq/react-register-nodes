import React from 'react';
import { render, cleanup } from 'react-testing-library';

import {
  NodeManager,
  useNodes,
  useOrderedNodes,
  useRegisteredRef,
} from '../src/index';

afterEach(cleanup);

const NodeToRegister = ({ name }: { name: string }) => {
  const ref = useRegisteredRef(name);

  return <div data-test-id={`node-${name}`} ref={ref as any} />;
};

test('useNodes provides a map of nodes', () => {
  const ListKeys = () => {
    const nodes = useNodes();

    return <div data-testid="results">{Object.keys(nodes).join(',')}</div>;
  };

  const { getByTestId } = render(
    <NodeManager>
      <NodeToRegister name="yay" />
      <ListKeys />
    </NodeManager>
  );

  expect(getByTestId('results').textContent).toEqual('yay');
});

test('useOrderedNodes provides an array of nodes in Document Order', () => {
  const ListNodes = () => {
    const nodes = useOrderedNodes();

    return (
      <div data-testid="results">
        {nodes.map(node => node.dataset.testId).join(',')}
      </div>
    );
  };

  const { getByTestId } = render(
    <NodeManager>
      <NodeToRegister name="three" />
      <NodeToRegister name="one" />
      <NodeToRegister name="two" />
      <ListNodes />
    </NodeManager>
  );

  expect(getByTestId('results').textContent).toEqual(
    'node-three,node-one,node-two'
  );
});

test('useOrderedNodes accepts a custom sorter', () => {
  const ListNodes = () => {
    const nodes = useOrderedNodes(n => {
      return n.sort((a, b) => {
        if (a.dataset.testId![5] > b.dataset.testId![5]) {
          return 1;
        } else if (a.dataset.testId![5] > b.dataset.testId![5]) {
          return -1;
        } else {
          return 0;
        }
      });
    });

    return (
      <div data-testid="results">
        {nodes.map(node => node.dataset.testId).join(',')}
      </div>
    );
  };

  const { getByTestId } = render(
    <NodeManager>
      <NodeToRegister name="c" />
      <NodeToRegister name="a" />
      <NodeToRegister name="b" />
      <ListNodes />
    </NodeManager>
  );

  expect(getByTestId('results').textContent).toEqual('node-a,node-b,node-c');
});
