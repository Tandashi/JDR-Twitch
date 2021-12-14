import React from 'react';
import { DateTime, Duration } from 'luxon';

import ESBService from '@services/esb-api-service';
import IQueue, { IQueueEntry } from '@models/queue';
import ToggleButton from '@components/form/toggle';

import '@styles/live-config.sass';
import ESBSocketIOService from '@services/esb-socketio-service';
import ESBApiService from '@services/esb-api-service';

interface Props {
  isEmbed: boolean;
}

interface State {
  time: DateTime;
  selected?: IQueueEntry;
  queue: IQueue;
}

export default class LiveConfigPage extends React.Component<Props, State> {
  private interval: NodeJS.Timer;

  constructor(props: Props) {
    super(props);

    this.state = {
      time: DateTime.now(),
      selected: undefined,
      queue: {
        enabled: false,
        entries: [],
      },
    };
  }

  componentDidMount(): void {
    this.loadQueue();
    this.loadTheme();
    this.registerSocketHandler();
    this.startTimeInterval();
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
  }

  private startTimeInterval(): void {
    this.interval = setInterval(() => this.setState({ time: DateTime.now() }), 5000);
  }

  async registerSocketHandler(): Promise<void> {
    ESBSocketIOService.registerHandler('v1/queue:updated', (queue: IQueue) => {
      this.setState({
        queue: queue,
      });
    });

    ESBSocketIOService.registerHandler('v1/next-up:set', (entry: IQueueEntry) => {
      this.setState({
        selected: entry,
      });
    });

    ESBSocketIOService.registerHandler('v1/next-up:cleared', () => {
      this.setState({
        selected: undefined,
      });
    });
  }

  async loadQueue(): Promise<void> {
    const responseResult = await ESBService.getQueue();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({ queue: responseResult.data.data });
      }
    }
  }

  async loadTheme(): Promise<void> {
    const responseResult = await ESBApiService.getStreamerConfiguration();
    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        const theme = responseResult.data.data.theme;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = theme.liveConfig.css;
        document.head.appendChild(styleElement);
      }
    }
  }

  private async handleSelect(index: number): Promise<void> {
    const responseResult = await ESBService.announceQueueEntry(index);

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      // Remove entry from the Queue
      await this.handleRemove(index);
    }
  }

  private async handleToggle(): Promise<void> {
    await ESBService.setQueueStatus(!this.state.queue.enabled);
  }

  private async handleQueueClear(): Promise<void> {
    const responseResult = await ESBService.clearQueue();

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      this.setState({
        selected: undefined,
      });
    }
  }

  private async handleRemove(index: number): Promise<void> {
    await ESBService.deleteFromQueue(index);
  }

  private handleRemoveSelected(): void {
    ESBSocketIOService.clearUpNext();
  }

  private async handleRandomSelect(): Promise<void> {
    const length = this.state.queue.entries.length;
    const randomIndex = Math.floor(Math.random() * length);

    this.handleSelect(randomIndex);
  }

  private getUserStateText(entry: IQueueEntry): string {
    // Mobile User
    if (entry.userState === undefined) {
      return 'Unknown (Mobile)';
    }

    if (entry.userState.inChat) {
      return 'In Chat';
    }

    let timeText;
    const lastSeenDateTime = DateTime.fromMillis(entry.userState.lastSeen);
    const differenceToNow: Duration = this.state.time.diff(lastSeenDateTime).shiftTo('seconds', 'minutes', 'hours');

    if (differenceToNow.minutes === 0 && differenceToNow.hours === 0) {
      timeText = `${differenceToNow.seconds.toFixed(0)} seconds ago`;
    } else if (differenceToNow.minutes > 0 && differenceToNow.hours === 0) {
      timeText = `${differenceToNow.minutes} minute(s) ago`;
    } else if (differenceToNow.minutes > 0 && differenceToNow.hours > 0) {
      timeText = `${differenceToNow.hours} hour(s) ago`;
    }

    return timeText;
  }

  public render(): JSX.Element {
    return (
      <div id='queue-overview' className={'flex flex-1 flex-col space-y-4 select-none'}>
        {!this.props.isEmbed ? (
          <div
            id='controls-container'
            className={
              'flex flex-row items-center p-2 sm:p-4 text-xs sm:text-sm md:text-base space-x-4 md:space-x-10 bg-gray-800'
            }
          >
            <div id='queue-toggle-container' className={'flex flex-row items-center'}>
              <p className={'text-white font-bold pr-2 md:pr-4'}>Queue</p>
              <ToggleButton
                id='queue-toggle-button'
                checked={this.state.queue.enabled}
                onToggle={() => this.handleToggle()}
              />
            </div>

            <div
              id='queue-clear-button'
              className={'ripple-bg-purple-600 bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded cursor-pointer'}
              onClick={() => this.handleQueueClear()}
            >
              <p className={'font-bold text-white'}>Clear Queue</p>
            </div>

            <div
              id='queue-random-button'
              className={'ripple-bg-purple-600 bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded cursor-pointer'}
              onClick={() => this.handleRandomSelect()}
            >
              <p className={'font-bold text-white'}>Pick Random</p>
            </div>
          </div>
        ) : undefined}

        <div id='next-up-container' className={'p-4'}>
          <div id='next-up-banner' className={'flex justify-between bg-blue-500 py-4 px-4 rounded'}>
            <div id='next-up-info' className={''}>
              <p id='next-up-info-title' className={'text-base font-bold text-white'}>{`Next Up: ${
                this.state.selected?.title ?? '-'
              }`}</p>
              <p id='next-up-info-username' className={'text-xs text-white'}>{`Request by: ${
                this.state.selected?.username ?? '-'
              }`}</p>
            </div>
            {this.state.selected && !this.props.isEmbed ? (
              <div id='next-up-controls-container' className={'self-center'}>
                <div
                  id='next-up-clear-button'
                  className={'flex ripple-bg-red-500 bg-red-400 hover:bg-red-600 py-2 px-2 rounded cursor-pointer'}
                  onClick={() => this.handleRemoveSelected()}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 self-center justify-self-center'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='#fff'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </div>
              </div>
            ) : undefined}
          </div>
        </div>

        <div id='queue-container' className={'flex-1 p-4 space-y-4'}>
          {this.state.queue.entries.map((e, i) => {
            return (
              <div className={'queue-entry flex flex-row justify-between bg-purple-500 py-4 px-4 rounded'}>
                <div className={'queue-entry-header'}>
                  <p className={'queue-entry-title text-base font-bold text-white'}>{e.title}</p>
                  <p className={'queue-entry-username text-xs text-white'}>{`Request by: ${
                    e.username ?? 'Unknown'
                  }`}</p>
                  {!this.props.isEmbed ? (
                    <p className={'queue-entry-user-state text-xs text-white'}>
                      Last seen:{' '}
                      <a
                        className={
                          e.userState?.inChat
                            ? 'queue-entry-user-state-in-chat text-green-200'
                            : 'queue-entry-user-state-last-seen text-red-200'
                        }
                      >
                        {this.getUserStateText(e)}
                      </a>
                    </p>
                  ) : undefined}
                </div>
                {!this.props.isEmbed ? (
                  <div className={'queue-entry-controls-container flex flex-row space-x-4 self-center'}>
                    <div
                      className={
                        'queue-entry-pick-button flex text-xs sm:text-sm md:text-base ripple-bg-blue-500 bg-blue-400 hover:bg-blue-600 py-2 px-2 rounded cursor-pointer'
                      }
                      onClick={() => this.handleSelect(i)}
                    >
                      <p className={'self-center justify-self-center font-bold text-white'}>Pick next</p>
                    </div>
                    <div
                      className={
                        'queue-entry-delete-button flex ripple-bg-red-500 bg-red-400 hover:bg-red-600 py-2 px-2 rounded cursor-pointer'
                      }
                      onClick={() => this.handleRemove(i)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 self-center justify-self-center'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='#fff'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </div>
                  </div>
                ) : undefined}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
