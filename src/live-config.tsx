import React from 'react';
import ReactDOM from 'react-dom';

import LiveConfig from '@pages/live-config';
import ConfigService from '@services/config-service';
import ESBSocketIOService from '@services/esb-socketio-service';

// If its meant for embedding or not
const isEmbed = new URL(window.location.href).searchParams.has('embed');

window.Twitch.ext.onAuthorized((auth) => {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    twitch: {
      auth: auth,
    },
  });

  ESBSocketIOService.connect('jwt', auth.token);
  ReactDOM.render(<LiveConfig isEmbed={isEmbed} />, document.getElementById('root'));
});

const secret = new URL(window.location.href).searchParams.get('secret');
if (secret) {
  const config = ConfigService.getConfig();
  ConfigService.setConfig({
    ...config,
    ebs: {
      ...config.ebs,
      secret: secret,
    },
  });

  ESBSocketIOService.connect('secret', secret);
  ReactDOM.render(<LiveConfig isEmbed={isEmbed} />, document.getElementById('root'));
}
