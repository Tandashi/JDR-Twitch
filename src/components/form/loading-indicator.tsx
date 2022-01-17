import React from 'react';

import SushiRollsTableIcon from '@components/icons/sushi-rolls-table';

export default class LoadingIndicator extends React.Component {
  public render(): JSX.Element {
    return (
      <div className='flex items-center justify-center flex-1'>
        <div className='flex flex-1 flex-col justify-center items-center space-x-1 text-white'>
          <div className={'w-24 h-24 animate-pulse'}>
            <SushiRollsTableIcon />
          </div>
          <p className={'text-xs md:text-base font-bold'}>Loading ...</p>
          <p className={'text-xs md:text-base mt-10'}>
            If loading takes a long time please check the{' '}
            <a target='_blank' className={'font-medium text-blue-300'} href={'https://status.tandashi.de/status'}>
              Status Page
            </a>{' '}
            or{' '}
            <a target='_blank' className={'font-medium text-blue-300'} href={'https://twitter.com/JDR_Twitch'}>
              Twitter
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
}
