import React from 'react';

import '@styles/components/form/accordion.sass';

import ChevronDown from '@components/icons/chevron-down';
import ChevronUp from '@components/icons/chevron-up';

interface Props {
  title: string;
  isOpen: boolean;
}

interface State {
  isOpen: boolean;
}

export default class Accordion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  private toggleOpen(): void {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  public render(): JSX.Element {
    return (
      <div className='accordion flex flex-col select-none'>
        <div
          className={`flex-1 flex flex-row justify-between items-center p-2 bg-gray-700 ${
            this.state.isOpen ? 'rounded-t' : ''
          }`}
          onClick={this.toggleOpen}
        >
          <p className='text-sm md:text-base text-white flex-start'>{this.props.title}</p>
          <div className='text-white flex-end'>{this.state.isOpen ? <ChevronUp /> : <ChevronDown />}</div>
        </div>
        <div className='bg-gray-800 rounded-b'>
          {this.state.isOpen ? <div className='p-1 mt-4'>{this.props.children}</div> : undefined}
        </div>
      </div>
    );
  }
}
