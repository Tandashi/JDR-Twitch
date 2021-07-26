import React from 'react';

import '@styles/panel.sass';
import SearchEntry from '@components/search-entry';

export default class Panel extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={'panel flex justify-center'}>
        <SearchEntry
          songdata={{
            title: "(I've Had) The Time Of My Life",
            artist: 'Bill Medley and Jennifer Warnes',
            source: '',
            unlimited: false,
            img_url: 'https://static.wikia.nocookie.net/justdance/images/4/44/Thetimeofmylife_jd4_cover_generic.png',
            difficulty: 1,
            coaches: 1,
            effort: 1,
          }}
        />
      </div>
    );
  }
}
