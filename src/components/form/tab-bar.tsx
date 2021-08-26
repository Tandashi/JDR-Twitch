import React from 'react';

import '@styles/components/tab-bar.sass';

interface Props {
  tabNames: string[];
}

interface State {
  selectedIndex: number;
  children: (React.ReactChild | React.ReactFragment | React.ReactPortal)[];
}

export default class TabBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      children: React.Children.toArray(this.props.children),
    };
  }

  private handleSelectTab(index: number): void {
    this.setState({
      selectedIndex: index,
    });
  }

  public render(): JSX.Element {
    return (
      <div className='flex flex-1 flex-col h-full overflow-auto'>
        <nav className='tab-bar-tabs bg-white flex flex-row'>
          {this.props.tabNames.map((tabName, index) => {
            const classes =
              index === this.state.selectedIndex ? 'text-blue-500 border-b-2 md:font-medium border-blue-500' : '';

            return (
              <div>
                <button
                  onClick={() => this.handleSelectTab(index)}
                  className={`text-xs sm:text-sm md:text-base text-gray-600 py-2 md:py-3 px-3 md:px-5 block hover:text-blue-500 focus:outline-none ${classes}`}
                >
                  {tabName}
                </button>
              </div>
            );
          })}
        </nav>
        <div className={'tab-bar-content overflow-auto'}>{this.state.children[this.state.selectedIndex]}</div>
      </div>
    );
  }
}
