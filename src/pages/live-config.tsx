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

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      this.setState({
        selected: this.state.queue.entries[index],
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
        selected: undefined,
        queue: responseResult.data.data,
      });
    }
  }

  private async handleRandomSelect(): Promise<void> {
    const length = this.state.queue.entries.length;
    const randomIndex = Math.floor(Math.random() * length);

    this.handleSelect(randomIndex);
  }

  public render(): JSX.Element {
    return (
      <div className={'flex flex-col space-y-6'}>
        <div className={'flex flex-row flex-1 items-center space-x-10 bg-gray-800'}>
          <div className={'flex flex-row items-center p-4'}>
            <p className={'text-base text-white font-bold pr-4'}>Queue</p>
            <ToggleButton id={'queueToggle'} checked={this.state.queue.enabled} onToggle={() => this.handleToggle()} />
          </div>

          <div
            className={'bg-purple-500 hover:bg-purple-700 py-2 px-4 border border-purple-700 rounded cursor-pointer'}
            onClick={() => this.handleQueueClear()}
          >
            <p className={'text-base font-bold text-white'}>Clear Queue</p>
          </div>

          <div
            className={'bg-purple-500 hover:bg-purple-700 py-2 px-4 border border-purple-700 rounded cursor-pointer'}
            onClick={() => this.handleRandomSelect()}
          >
            <p className={'text-base font-bold text-white'}>Pick Random</p>
          </div>
        </div>

        <div className={'p-4 space-y-4'}>
          {this.state.queue.entries.map((e, i) => {
            const isSelected = e.title === this.state.selected?.title;
            const classNames = isSelected
              ? 'bg-red-500 hover:bg-red-700 border-red-700'
              : 'bg-purple-500 hover:bg-purple-700 border-purple-700';

            return (
              <div
                className={`${classNames} py-4 px-4 border  rounded cursor-pointer`}
                onClick={isSelected ? () => this.handleRemove(i) : () => this.handleSelect(i)}
              >
                <p className={'text-base font-bold text-white'}>{isSelected ? 'Remove from Queue' : e.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
