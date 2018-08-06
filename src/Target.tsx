import * as React from 'react';
import { withContext, ManagerState } from './Manager';

export interface TargetProps {
  id: string;
  children: (props: TargetNodeProps | {}) => React.ReactNode;
  onMatch?: (node: HTMLElement) => void;
}

export interface TargetNodeProps {
  'data-first-matching-node-id': string;
}

class TargetImpl extends React.Component<
  TargetProps & Pick<ManagerState, 'name' | 'register'>
> {
  componentDidMount() {
    const { register, id, onMatch } = this.props;
    if (register) {
      register(id, onMatch);
    }
  }

  render() {
    const { children, id, name } = this.props;

    return children(
      name ? { 'data-first-matching-node-id': `${name}.${id}` } : {}
    );
  }
}

export const Target = withContext(TargetImpl);
