import React from 'react';

import ESBService from '@services/esb-service';
import IQueue from '@models/queue';

interface Props {}
interface State {
  queue: IQueue;
}

export default class QueuePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      queue: {
        channelId: undefined,
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

  public render(): JSX.Element {
    return (
      <div>
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
