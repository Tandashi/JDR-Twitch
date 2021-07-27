import React from 'react';

import '@styles/panel.sass';
import SearchEntry from '@components/search-entry';
import SearchBar from '@components/searchbar';

export default class Panel extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={'panel flex flex-col space-y-2 h-full w-full p-3'}>
        <SearchBar onChange={(e) => console.log(e.target.value)} />
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
