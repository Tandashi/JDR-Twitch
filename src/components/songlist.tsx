import React from 'react';

import '@styles/components/songlist.sass';
import ISongData from '@models/songdata';
import SearchEntry from '@components/search-entry';

interface Props {
  songdata: ISongData[];
  onSelect: (song: ISongData) => void;
}

interface ForwardedProps extends Props {
  innerRef: React.ForwardedRef<HTMLDivElement>;
}

class SongList extends React.Component<ForwardedProps> {
  public render(): JSX.Element {
    return (
      <div ref={this.props.innerRef} className={'songlist overflow-auto'}>
        <div className={'pr-2 space-y-2 overflow-auto'}>
          {this.props.songdata.map((song) => {
            return <SearchEntry onClick={() => this.props.onSelect(song)} songdata={song} />;
          })}
        </div>
      </div>
    );
  }
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => <SongList innerRef={ref} {...props} />);
