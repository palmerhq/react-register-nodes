import * as React from 'react';

// tslint:disable-next-line:no-empty
const noop = () => {};

export const Context = React.createContext<ManagerState>({} as any);

// Props the HOC adds to the wrapped component
type InjectedProps = Pick<ManagerState, 'name' | 'register'>;

export const withContext = <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & InjectedProps>
) => {
  const HOC: React.SFC<OriginalProps> = (props) => (
    <Context.Consumer>
      {({ register, name }) => (
        <Component name={name} register={register} {...props} />
      )}
    </Context.Consumer>
  );

  return HOC;
};

export interface ManagerProps {
  name: string;
  active: boolean;
  ids: string[];
}

export interface ManagerState {
  name: string;
  targets: { [key: string]: Function };
  register: (id: string, handler?: (node: HTMLElement) => void) => void;
  unregister: (id: string) => void;
}

export class Manager extends React.Component<ManagerProps, ManagerState> {
  static defaultProps = {
    active: true,
  };

  register = (id: string, handler?: (node: HTMLElement) => void) => {
    this.setState(({ targets }) => ({
      targets: {
        ...targets,
        [id]: handler || noop,
      },
    }));
  };

  unregister = (id: string) => {
    this.setState(({ targets }) => {
      const { [id]: removal, ...rest } = targets;
      return {
        targets: rest,
      };
    });
  };

  state: ManagerState = {
    name: this.props.name,
    targets: {},
    register: this.register,
    unregister: this.unregister,
  };

  componentDidUpdate() {
    const idsToCheck = Object.keys(this.state.targets).filter(target =>
      this.props.ids.includes(target)
    );

    if (this.props.active && idsToCheck.length > 0) {
      const idselectors = idsToCheck // only targets that are whitelisted
        .map(
          field => `[data-first-matching-node-id="${this.props.name}.${field}"]`
        );

      // since our selector includes all ids, the browser will return
      // them in the order they are found, thus we only need querySelector because
      // it will give us the first result. Since this block only runs if idsToCheck.length > 0,
      // we know that our query selector WILL return at least one result.
      const firstFieldInDom = document.querySelector<HTMLElement>(
        idselectors.join(',')
      )!;

      const [, firstFieldId] = firstFieldInDom.dataset.Id!.split('.');
      const handler = this.state.targets[firstFieldId];

      handler(firstFieldInDom);
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
