import React from 'react';

import { Result } from '@models/result';
import ISongData from '@models/songdata';

import ESBService, { ESBApiResponse } from '@services/esb-api-service';

import SongHeader from '@components/song/song-header';
import SongPreview from '@components/song/song-preview';
import SongStats from '@components/song/song-stats';
import StatusMessage, { StatusMessageDisplayType } from '@components/status-message';

import '@styles/components/song/song-details.sass';
import StarIcon from '@components/icons/star';
import IUserData from '@models/userdata';

interface Props {
  userData: IUserData;
  songdata: ISongData;
  onBack: () => void;
  onUserDataUpdated: (userData: IUserData) => void;
}

interface State {
  displayType: StatusMessageDisplayType;
  timeout?: NodeJS.Timeout;
}

export default class SongDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      displayType: {
        type: 'none',
      },
    };

    this.clearMessage = this.clearMessage.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
  }

  componentWillUnmount(): void {
    clearTimeout(this.state.timeout);
  }

  private isFavourite(): boolean {
    return this.props.userData.favouriteSongs.some((e) => e.id === this.props.songdata.id);
  }

  private clearMessage(): void {
    this.setState({
      displayType: {
        type: 'none',
      },
    });
  }

  private handleRequest<T>(response: Result<ESBApiResponse<T>, 'unauthorized'>, message: string): T | void {
    if (response.type === 'error') {
      return this.setState({
        timeout: setTimeout(this.clearMessage, 2000),
        displayType: {
          type: 'error',
          message: response.message,
        },
      });
    }

    if (response.data.code !== 200) {
      return this.setState({
        timeout: setTimeout(this.clearMessage, 2000),
        displayType: {
          type: 'error',
          message: response.data.error.message,
        },
      });
    }

    if (message) {
      return this.setState({
        timeout: setTimeout(this.clearMessage, 2000),
        displayType: {
          type: 'success',
          message: message,
        },
      });
    }

    return response.data.data;
  }

  public render(): JSX.Element {
    return (
      <div className={'song-details flex flex-col h-full py-4 overflow-auto'}>
        <div className={'flex-20 pr-6'}>
          <SongHeader songdata={this.props.songdata} />
        </div>

        <div className={'flex-80 flex flex-col space-y-4 px-6'}>
          <div className={'mt-3'}>
            <SongStats songdata={this.props.songdata} />
          </div>

          <div className={'flex-1'}>
            <SongPreview songdata={this.props.songdata} />
          </div>

          <div className={'flex flex-row space-x-2 mt-4 h-10'}>
            <div
              className={'song-details-button flex items-center justify-center flex-20 rounded-lg cursor-pointer'}
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
              className={
                'song-details-button song-details-request flex-60 rounded-lg flex items-center text-center cursor-pointer'
              }
              onClick={() => {}}
            >
              <p
                className={'flex-1 text-white'}
                onClick={() => {
                  ESBService.requestSong(this.props.songdata.id).then((response) =>
                    this.handleRequest(response, 'Song added successfully')
                  );
                }}
              >
                Request Song
              </p>
            </div>
            <div
              className={'song-details-button flex flex-20 rounded-lg items-center text-center cursor-pointer'}
              onClick={() => {
                const isFavourited = !this.isFavourite();
                const updateUserDataSongs = this.props.userData.favouriteSongs.map((e) => e.id);

                if (isFavourited) {
                  updateUserDataSongs.push(this.props.songdata.id);
                } else {
                  updateUserDataSongs.splice(updateUserDataSongs.indexOf(this.props.songdata.id), 1);
                }

                ESBService.updateUserData({
                  favouriteSongs: updateUserDataSongs,
                })
                  .then((response) => this.handleRequest(response, undefined))
                  .then((userData) => {
                    if (typeof userData !== 'object') {
                      return;
                    }

                    this.props.onUserDataUpdated(userData);
                  });
              }}
            >
              <div className='flex-1 p-3'>
                <StarIcon fill={this.isFavourite() ? 'yellow-400' : 'gray-500'} />
              </div>
            </div>
          </div>
        </div>

        <StatusMessage displayType={this.state.displayType} />
      </div>
    );
  }
}
