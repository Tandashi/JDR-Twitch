import React from 'react';
import ReactDOM from 'react-dom';

import Panel from '@pages/panel';
import UnauthorizedPage from '@pages/unauthorized';

import ConfigService from '@services/config-service';

window.Twitch.ext.onAuthorized((auth) => {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    twitch: {
      auth: auth,
    },
  });

  const parts = auth.token.split('.');
  const payload = JSON.parse(window.atob(parts[1]));

  // Check if user has granted permission
  if (payload.user_id) {
    // user HAS granted
    ReactDOM.render(<Panel />, document.getElementById('root'));
  }
  else {
    // user has NOT granted
    ReactDOM.render(<UnauthorizedPage />, document.getElementById('root'));
  }
});
