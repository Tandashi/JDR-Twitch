import React from 'react';

import ESBService from '@services/esb-service';
import IQueue from '@models/queue';
import ToggleButton from '@components/form/toggle';

import '@styles/live-config.sass';

interface Props {}
interface State {
  queue: IQueue;
}

export default class LiveConfigPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      queue: {
        enabled: false,
        entries: [],
      },
    };
  }

  async componentDidMount(): Promise<void> {
    setInterval(() => {
      this.loadQueue();
    }, 3000);
  }

  async loadQueue(): Promise<void> {
    const responseResult = await ESBService.getQueueWithSecret();

    if (responseResult.type === 'success') {
      if (responseResult.data.code === 200) {
        this.setState({ queue: responseResult.data.data });
      }
    }
  }

  private async handleSelect(index: number): Promise<void> {
    const responseResult = await ESBService.deleteFromQueue(index);

    if (responseResult.type === 'success' && responseResult.data.code === 200) {
      this.setState({
        queue: responseResult.data.data,
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
        queue: responseResult.data.data,
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <ToggleButton id={'queueToggle'} checked={this.state.queue.enabled} onToggle={() => this.handleToggle()} />

        <div onClick={() => this.handleQueueClear()}>Clear</div>

        {this.state.queue.entries.map((e, i) => {
          return (
            <div onClick={() => this.handleSelect(i)} className={''}>
              <p className={'truncate'}>{e.title}</p>
            </div>
          );
        })}
      </div>
    );
  }
}
