import React from 'react';
import ReactDOM from 'react-dom';

import Configuration from '@pages/configuration';
import ConfigService from '@services/config-service';

import '@styles/configuration.sass';

window.Twitch.ext.onAuthorized((auth) => {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    twitch: {
      auth: auth,
    },
  });

  ReactDOM.render(<Configuration />, document.getElementById('root'));
});
