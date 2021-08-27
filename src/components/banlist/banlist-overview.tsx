import React from 'react';

import BanlistEntry from './banlist-entry';
import ISongData from '@models/songdata';

import '@styles/components/banlist/banlist-overview.sass';

interface Props {
  songdata: ISongData[];
  banlist: {
    [k: string]: ISongData;
  };
  onBan: (song: ISongData) => void;
}

export default class BanlistOverview extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className={'banlist-overview overflow-auto'}>
        <div className={'flex items-center justify-center flex-wrap overflow-auto'}>
          {this.props.songdata.map((s) => {
            return (
              <div className={'w-1/2 md:w-1/3 p-2'}>
                <BanlistEntry
                  banned={this.props.banlist[s.id] !== undefined}
                  songdata={s}
                  onClick={() => this.props.onBan(s)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
