import React from 'react';
import ReactDOM from 'react-dom';

import Panel from '@pages/panel';

import ConfigService from '@services/config-service';

window.Twitch.ext.onAuthorized((auth) => {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    twitch: {
      auth: auth,
    },
  });

  ReactDOM.render(<Panel />, document.getElementById('root'));
});