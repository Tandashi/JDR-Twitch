import React from 'react';

import ISongData from '@models/songdata';
import IQueue from '@models/queue';

import ESBService, { ESBResponse } from '@services/esb-service';

import SongHeader from '@components/song/song-header';
import SongPreview from '@components/song/song-preview';
import SongStats from '@components/song/song-stats';

import '@styles/components/song/song-details.sass';
import { AxiosError } from 'axios';

type DisplayType =
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
  songdata: ISongData;
  onBack: () => void;
}

interface State {
  displayType: DisplayType;
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
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentWillUnmount(): void {
    clearTimeout(this.state.timeout);
  }

  private clearMessage(): void {
    this.setState({
      displayType: {
        type: 'none',
      },
    });
  }

  private handleSuccess(response: ESBResponse<IQueue>): void {
    if (response.code === 200) {
      this.setState({
        timeout: setTimeout(this.clearMessage, 2000),
        displayType: {
          type: 'success',
          message: 'Song added successfully',
        },
      });
    }
  }

  private handleError(err: AxiosError<ESBResponse<IQueue>>): void {
    if (err.response.data.code !== 200) {
      this.setState({
        timeout: setTimeout(this.clearMessage, 2000),
        displayType: {
          type: 'error',
          message: err.response.data.error.message,
        },
      });
    }
  }

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
                ESBService.requestSong(this.props.songdata.id).then(this.handleSuccess).catch(this.handleError);
              }}
            >
              Request Song
            </p>
          </div>
        </div>

        {this.state.displayType.type !== 'none' && (
          <div
            className={`status-message status-message-${this.state.displayType.type} flex items-center justify-center px-4 w-full`}
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
                      this.state.displayType.type === 'error'
                        ? // Error
                          'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : // Success
                          'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    }
                  />
                </svg>
              </div>
              <p className={'message text-center'}>{this.state.displayType.message}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}
