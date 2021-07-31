import React from 'react';

import ISongData from '@models/songdata';

import SongHeader from '@components/song/song-header';
import SongPreview from '@components/song/song-preview';
import SongStats from '@components/song/song-stats';

import '@styles/components/song/song-details.sass';
import ESBService from '@services/esb-service';

interface Props {
  songdata: ISongData;
  onBack: () => void;
}

export default class SongDetails extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'song-details flex flex-col py-4 h-full'}>
        <div className={'pr-6'}>
          <SongHeader songdata={this.props.songdata} />
        </div>

        <div className={'mt-3 px-6'}>
          <SongStats songdata={this.props.songdata} />
        </div>

        <div className={'flex-1 mt-10 px-6 h-1/3'}>
          <SongPreview songdata={this.props.songdata} />
        </div>

        <div className={'flex flex-row space-x-2 px-6 mt-4 h-10'}>
          <div
            className={'song-details-button song-details-back flex items-center justify-center flex-20 rounded-lg'}
            onClick={() => this.props.onBack()}
          >
            <svg
              xmlns={'http://www.w3.org/2000/svg'}
              className={'h-3/5 w-auto self-center flex-1'}
              fill={'none'}
              viewBox={'0 0 24 24'}
              stroke={'#fff'}
            >
              <path strokeLinecap={'round'} strokeLinejoin={'round'} strokeWidth={2} d={'M15 19l-7-7 7-7'} />
            </svg>
          </div>
          <div
            className={'song-details-button song-details-request flex-80 rounded-lg flex items-center text-center'}
            onClick={() => {}}
          >
            <p
              className={'flex-1'}
              onClick={() => {
                ESBService.requestSong(this.props.songdata.id);
              }}
            >
              Request Song
            </p>
          </div>
        </div>
      </div>
    );
  }
}
