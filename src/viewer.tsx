import React from 'react';
import ReactDOM from 'react-dom';

import Panel from '@pages/panel';
import ErrorDisplayPage from '@pages/error-display';

import ConfigService from '@services/config-service';
import ESBSocketIOService from '@services/esb-socketio-service';

window.Twitch.ext.onAuthorized((auth) => {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    twitch: {
      auth: auth,
    },
  });

  if (!window.Twitch.ext.viewer.isLinked) {
    window.Twitch.ext.actions.requestIdShare();
    ReactDOM.render(
      <ErrorDisplayPage>
        Please grant permissions to the extension.
        <br />
        It is needed to work properly 🥳.
      </ErrorDisplayPage>,
      document.getElementById('root')
    );
    return;
  }

  ESBSocketIOService.connect('jwt', auth.token);

  ReactDOM.render(<Panel />, document.getElementById('root'));
});
