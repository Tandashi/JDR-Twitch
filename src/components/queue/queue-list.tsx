import React from 'react';

import IQueue from '@models/queue';

import QueueEntry from '@components/queue/queue-entry';

interface Props {
  queue: IQueue;
}

interface ForwardedProps extends Props {
  innerRef: React.ForwardedRef<HTMLDivElement>;
}

class QueueList extends React.Component<ForwardedProps> {
  public render(): JSX.Element {
    return (
      <div ref={this.props.innerRef} className='scrollbar space-y-2 overflow-auto pr-2'>
        {this.props.queue.entries.map((e, i) => (
          <QueueEntry position={i + 1} entry={e} />
        ))}
      </div>
    );
  }
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => <QueueList innerRef={ref} {...props} />);
