import React from 'react';

import { Result } from '@models/result';

import { ESBResponse } from '@services/esb-service';

interface Props {
  text: string;
  onClick: () => Promise<Result<ESBResponse<any>, any>[]>;
  duration: number;
}

enum DisplayState {
  NONE,
  LOADING,
  SUCCESS,
  FAIL,
}

interface State {
  display: {
    state: DisplayState;
    timeout: NodeJS.Timeout;
  };
}

export default class ResultButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      display: {
        state: DisplayState.NONE,
        timeout: undefined,
      },
    };

    this.handleClick = this.handleClick.bind(this);
    this.clearDisplayState = this.clearDisplayState.bind(this);
  }

  private clearDisplayState(): void {
    this.setState({
      display: {
        state: DisplayState.NONE,
        timeout: undefined,
      },
    });
  }

  private async processClick(): Promise<void> {
    const result = await this.props.onClick();

    const error = result.some((r) => r.type === 'error');
    const state = error ? DisplayState.FAIL : DisplayState.SUCCESS;
    const timeout = setTimeout(this.clearDisplayState, this.props.duration);

    this.setState({
      display: {
        state: state,
        timeout: timeout,
      },
    });
  }

  private handleClick(): void {
    this.processClick();

    this.setState({
      display: {
        ...this.state.display,
        state: DisplayState.LOADING,
      },
    });
  }

  public render(): JSX.Element {
    let classes;

    switch (this.state.display.state) {
      case DisplayState.NONE:
      case DisplayState.LOADING:
        classes = 'ripple-bg-purple-500 bg-purple-400 hover:bg-purple-600';
        break;
      case DisplayState.SUCCESS:
        classes = 'bg-green-400 disabled';
        break;
      case DisplayState.FAIL:
        classes = 'bg-red-400 disabled';
        break;
    }

    return (
      <button
        className={`flex h-full w-32 text-xs md:text-base ${classes} px-2 py-1 rounded cursor-pointer`}
        onClick={this.handleClick}
        disabled={this.state.display.state !== DisplayState.NONE}
      >
        <div className={'flex w-full items-center justify-center self-center justify-self-center text-white'}>
          {this.state.display.state === DisplayState.NONE ? this.props.text : undefined}

          {this.state.display.state === DisplayState.LOADING ? (
            <svg
              fill='none'
              className='h-4 md:h-6 w-4 md:w-6 animate-spin'
              viewBox='0 0 32 32'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                clip-rule='evenodd'
                d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                fill='currentColor'
                fill-rule='evenodd'
              />
            </svg>
          ) : undefined}

          {this.state.display.state === DisplayState.SUCCESS ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 md:h-6 w-4 md:w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          ) : undefined}

          {this.state.display.state === DisplayState.FAIL ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 md:h-6 w-4 md:w-6'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          ) : undefined}
        </div>
      </button>
    );
  }
}
