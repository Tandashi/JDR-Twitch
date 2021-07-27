import React, { ChangeEvent, ChangeEventHandler } from 'react';

import '@styles/components/searchbar.sass';

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

interface State {
  value: string;
}

export default class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>): void {
    this.props.onChange(event);
    this.setState({ value: event.target.value });
  }

  public render(): JSX.Element {
    return (
      <div className={'searchbar rounded flex flex-row'}>
        <span className={'flex items-center px-3'}>
          <svg className={'h-6 w-6'} fill={'none'} viewBox={'0 0 24 24'} stroke={'#fff'}>
            <path
              strokeLinecap={'round'}
              strokeLinejoin={'round'}
              strokeWidth={2}
              d={'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'}
            />
          </svg>
        </span>

        <input
          className={'flex-1 pr-4 rounded-r bg-transparent'}
          spellCheck={false}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
