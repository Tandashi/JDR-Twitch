import React from 'react';

import '@styles/components/status-message.sass';

export type StatusMessageDisplayType =
  | {
      type: 'success';
      message: string;
    }
  | {
      type: 'none';
    }
  | {
      type: 'error';
      message: string;
    };

interface Props {
  displayType: StatusMessageDisplayType;
}

export default class StatusMessage extends React.Component<Props> {
  public render(): JSX.Element {
    if (this.props.displayType.type === 'none') return <></>;

    return (
      <div
        className={`status-message status-message-${this.props.displayType.type} flex items-center justify-center px-4 w-full`}
      >
        <div className={'status-message-content flex flex-col items-center rounded p-4 space-y-2'}>
          <div className={'icon'}>
            <svg
              xmlns={'http://www.w3.org/2000/svg'}
              className={'h-12 w-12'}
              fill={'none'}
              viewBox={'0 0 24 24'}
              stroke={'#fff'}
            >
              <path
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
                strokeWidth={1}
                d={
                  this.props.displayType.type === 'error'
                    ? // Error
                      'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    : // Success
                      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                }
              />
            </svg>
          </div>
          <p className={'message text-center text-white'}>{this.props.displayType.message}</p>
        </div>
      </div>
    );
  }
}
