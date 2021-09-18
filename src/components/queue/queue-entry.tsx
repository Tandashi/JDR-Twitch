import React from 'react';

import { IQueueEntry } from '@models/queue';

interface Props {
  position: number;
  entry: IQueueEntry;
}

export default class QueueEntry extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div
        className={
          'flex flex-row rounded bg-gray-400 bg-opacity-40 divide-dashed divide-gray-200 divide-x divide-opacity-40'
        }
      >
        <div className='flex-20 self-center text-center text-white'>
          <p className='text-lg'>{this.props.position}</p>
        </div>
        <div className={'flex-80 flex-grow-4 flex-shrink-0 pl-3 p-2 min-w-0 self-center text-white'}>
          <p className={'text-sm md:text-base lg:text-lg truncate'}>{this.props.entry.title}</p>
          <p className={'text-xs md:text-sm lg:text-base truncate'}>
            Source:{' '}
            {this.props.entry.fromChat ? (
              <a className='text-yellow-200'>Chat</a>
            ) : (
              <a className='text-blue-200'>Extension</a>
            )}
          </p>
        </div>
      </div>
    );
  }
}
