import React, { ChangeEvent, ChangeEventHandler } from 'react';

import '@styles/components/search/searchbar.sass';

interface Props {
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

interface State {
  value: string;
}

export default class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: this.props.value ?? '' };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>): void {
    this.props.onChange(event);
    this.setState({ value: event.target.value });
  }

  public render(): JSX.Element {
    return (
      <div className={'searchbar flex-1 rounded flex flex-row'}>
        <span className={'flex items-center px-3'}>
          <svg className={'h-6 retina-144:h-4 w-6 retina-144:w-4'} fill={'none'} viewBox={'0 0 24 24'} stroke={'#fff'}>
            <path
              strokeLinecap={'round'}
              strokeLinejoin={'round'}
              strokeWidth={2}
              d={'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'}
            />
          </svg>
        </span>

        <input
          className={
            'flex-1 text-base sm:text-xs md:text-sm retina-144:text-sm pr-4 md:pr-3 retina-144:pr-3 rounded-r bg-transparent'
          }
          spellCheck={false}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
