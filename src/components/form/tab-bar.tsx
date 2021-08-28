import React from 'react';

import TabBarContent from '@components/form/tab-bar-content';
import TabBarAccessories from '@components/form/tab-bar-accessories';

import '@styles/components/tab-bar.sass';

interface Props {
  tabNames: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default class TabBar extends React.Component<Props> {
  public render(): JSX.Element {
    const children = React.Children.toArray(this.props.children);

    let tabBarContent, tabBarAccessories;

    for (const child of children) {
      switch ((child as any).type.name) {
        case TabBarAccessories.name:
          tabBarAccessories = child;
          break;
        case TabBarContent.name:
          tabBarContent = child;
          break;
      }
    }

    const tabBarContentChildren = (tabBarContent as TabBarContent)?.props?.children;

    return (
      <div className='flex flex-1 flex-col h-full overflow-auto'>
        <div className='tab-bar-tabs bg-gray-100 flex flex-row justify-between items-center'>
          <div className={'flex flex-row self-start'}>
            {this.props.tabNames.map((tabName, index) => {
              const classes =
                index === this.props.selectedIndex ? 'text-purple-500 border-b-2 md:font-medium border-purple-500' : '';

              return (
                <button
                  onClick={() => this.props.onSelect(index)}
                  className={`text-xs md:text-base text-gray-600 py-2 md:py-3 px-3 md:px-5 block hover:text-purple-500 focus:outline-none ${classes}`}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
          <div className={'flex h-full self-end'}>{tabBarAccessories}</div>
        </div>
        <div className={'tab-bar-content flex flex-1 overflow-auto'}>
          {React.Children.toArray(tabBarContentChildren)[this.props.selectedIndex]}
        </div>
      </div>
    );
  }
}
