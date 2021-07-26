import React from 'react';

import '@styles/panel.sass';

export default class Panel extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={'panel'}>
        <div
          className={
            'origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
          }
          role={'menu'}
          aria-orientation={'vertical'}
          aria-labelledby={'menu-button'}
          tabIndex={-1}
        >
          <div className={'py-1'} role={'none'}>
            <a
              href={'#'}
              className={'text-gray-700 block px-4 py-2 text-sm'}
              role={'menuitem'}
              tabIndex={-1}
              id={'menu-item-0'}
            >
              Account settings
            </a>
            <a
              href={'#'}
              className={'text-gray-700 block px-4 py-2 text-sm'}
              role={'menuitem'}
              tabIndex={-1}
              id={'menu-item-1'}
            >
              Support
            </a>
            <a
              href={'#'}
              className={'text-gray-700 block px-4 py-2 text-sm'}
              role={'menuitem'}
              tabIndex={-1}
              id={'menu-item-2'}
            >
              License
            </a>
            <form method={'POST'} action={'#'} role={'none'}>
              <button
                type={'submit'}
                className={'text-gray-700 block w-full text-left px-4 py-2 text-sm'}
                role={'menuitem'}
                tabIndex={-1}
                id={'menu-item-3'}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
