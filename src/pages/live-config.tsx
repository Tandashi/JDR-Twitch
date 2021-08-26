import React from 'react';

import ESBService from '@services/esb-service';
import IQueue, { IQueueEntry } from '@models/queue';
import ToggleButton from '@components/form/toggle';

import '@styles/live-config.sass';

interface Props {}
interface State {
  interval?: NodeJS.Timeout;
  selected?: IQueueEntry;
  queue: IQueue;
}

export default class LiveConfigPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selected: undefined,
      interval: undefined,
      queue: {
        enabled: false,
        entries: [],
      },
    };
  }

  componentDidMount(): void {
    this.setState({
      interval: setInterval(() => {
        this.loadQueue();
      }, 3000),
    });
  }

  componentWillUnmount(): void {
    clearInterval(this.state.interval);
  }

  async loadQueue(): Promise<void> {
    const responseResult = await ESBService.getQueue();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({ queue: responseResult.data.data });
      }
    }
  }

  private async handleSelect(index: number): Promise<void> {
    const responseResult = await ESBService.announceQueueEntry(index);
    const selected = this.state.queue.entries[index];

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      // Remove entry from the Queue
      await this.handleRemove(index);
      this.setState({
        selected: selected,
      });
    }
  }

  private async handleToggle(): Promise<void> {
    await ESBService.setQueueStatus(!this.state.queue.enabled);

    this.setState({
      queue: {
        ...this.state.queue,
        enabled: !this.state.queue.enabled,
      },
    });
  }

  private async handleQueueClear(): Promise<void> {
    const responseResult = await ESBService.clearQueue();

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      this.setState({
        selected: undefined,
        queue: responseResult.data.data,
      });
    }
  }

  private async handleRemove(index: number): Promise<void> {
    const responseResult = await ESBService.deleteFromQueue(index);

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      this.setState({
        queue: responseResult.data.data,
      });
    }
  }

  private handleRemoveSelected(): void {
    this.setState({
      selected: undefined,
    });
  }

  private async handleRandomSelect(): Promise<void> {
    const length = this.state.queue.entries.length;
    const randomIndex = Math.floor(Math.random() * length);

    this.handleSelect(randomIndex);
  }

  public render(): JSX.Element {
    return (
      <div className={'flex flex-col space-y-4 select-none'}>
        <div
          className={
            'flex flex-row flex-1 items-center p-2 sm:p-4 text-xs sm:text-sm md:text-base space-x-4 md:space-x-10 bg-gray-800'
          }
        >
          <div className={'flex flex-row items-center'}>
            <p className={'text-white font-bold pr-2 md:pr-4'}>Queue</p>
            <ToggleButton id={'queueToggle'} checked={this.state.queue.enabled} onToggle={() => this.handleToggle()} />
          </div>

          <div
            className={'ripple-bg-purple-600 bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded cursor-pointer'}
            onClick={() => this.handleQueueClear()}
          >
            <p className={'font-bold text-white'}>Clear Queue</p>
          </div>

          <div
            className={'ripple-bg-purple-600 bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded cursor-pointer'}
            onClick={() => this.handleRandomSelect()}
          >
            <p className={'font-bold text-white'}>Pick Random</p>
          </div>
        </div>

        <div className={'p-4'}>
          <div className={'flex justify-between bg-blue-500 py-4 px-4 rounded'}>
            <div className={''}>
              <p className={'text-base font-bold text-white'}>{`Next Up: ${this.state.selected?.title ?? '-'}`}</p>
              <p className={'text-xs text-white'}>{`Request by: ${this.state.selected?.username ?? '-'}`}</p>
            </div>
            {this.state.selected ? (
              <div className={'self-center'}>
                <div
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

        <div className={'p-4 space-y-4'}>
          {this.state.queue.entries.map((e, i) => {
            return (
              <div className={'flex flex-row justify-between bg-purple-500 py-4 px-4 rounded cursor-pointer'}>
                <div className={''}>
                  <p className={'text-base font-bold text-white'}>{e.title}</p>
                  <p className={'text-xs text-white'}>{`Request by: ${e.username ?? 'Unknown'}`}</p>
                </div>
                <div className={'flex flex-row space-x-4 self-center'}>
                  <div
                    className={
                      'flex text-xs sm:text-sm md:text-base ripple-bg-blue-500 bg-blue-400 hover:bg-blue-600 py-2 px-2 rounded cursor-pointer'
                    }
                    onClick={() => this.handleSelect(i)}
                  >
                    <p className={'self-center justify-self-center font-bold text-white'}>Pick next</p>
                  </div>
                  <div
                    className={'flex ripple-bg-red-500 bg-red-400 hover:bg-red-600 py-2 px-2 rounded cursor-pointer'}
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
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
