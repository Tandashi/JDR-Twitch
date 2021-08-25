# Just Dance Requests - Twitch Extension

The extension allows the users to request songs for Just Dance streamers.

The streamer can configure the extension with the game version, if they have Just Dance Unlimited as well as banning certain songs from being requested.
All this has been done on the review channel already. Then the viewers can request songs from that list in the panel / video component (both are the same just different html to differentiate)

## Building the Extension

To build the extension you need the following:

- NodeJS v11+ (Tested with 16.6.2)
- Yarn (Tested with 3.0.1)

```bash
# Install Dependencies
yarn install

# Server Environments
# - prod: Production Server
# - dev: Development Server
# - local: Local Test Server

# Build minified (Will create extension.zip in dist/)
SERVER=prod yarn deploy

# Build non-minified
SERVER=prod yarn build

# Build with file watch
SERVER=prod yarn watch
```

## Development Process

Got to `https://dev.twitch.tv/console/extensions/nv9ue0u2753fk3n1n9ghrvd28e3r9v` (Twitch Developer Console).
Manage the version to develop on / clone the latest one and change the `Testing Base URL` in `Asset Hosting`.
This however should not be needed if static assets are hosted on `http://localhost:8080` and the previous version has been cloned.

### Host Assets

Hosting assets statically on `localhost`

```bash
yarn server-static
```

### Technical Problems / Common Issues

If the extension can't load it is probably due to the fact that twitch only allows `https` connections. So either you need a ssl certificate for localhost or you can enable insecure localhost. This can be done as follows:

1. Navigate to `chrome://flags/#allow-insecure-localhost`
2. Change the flag to enabled
3. Restart your browser

Documentation on this topic can be found [here](https://dev.twitch.tv/docs/extensions#develop-your-extension).

## Twitch Review Process Instructions

The ESB (Backend Service) should be available 24/7.

Viewer Walk-through:

1. Go to the channel.
2. Search for a song in the search
3. Click on a song
4. Click 'Request Song'
5. Click 'Request Song' again to see that you've reached the maximum of requests
6. Revoke Permissions. Extension should reload and ask for permissions.
7. Grant Permissions to see the songlist again

Live Configuration Walk-through:

1. Open the streamer dashboard
2. See that the song appears in the list
3. Click on the song to select it
4. Click on it once more to remove
5. Toggle the queue.
6. Now try to request a song again. It should not work.

Configuration Walk-through:

1. Open the configuration page of the extension
2. Change the Game Version (Song list should update)
3. Toggle Unlimited (Song list should update)
4. Check some songs and click 'Save'
5. Reload the viewer page
6. Search for a song that has been banned (should not appear)
7. Un-check the same song and click 'Save'
8. Reload the viewer page
9. Search for the song and it should appear again

Chat-Integration Walk-through:

1. Toggle on Chat-Integration (if not already) in the configuration and click 'Save'
2. Go to the review channel (Make sure there are songs banned and that the queue is empty)
3. Send the following message: '!banlist'. A message from JustDanceRequests should appear
4. Send the following message: '!sr Hello World'. On the Live Configuration Page the Song 'Hello World' should appear after max 5 seconds.
5. Select the Song / click on it. A message from JustDanceRequests should appear in the chat.
6. Click on 'Clear Queue' on the Live Configuration Page. A message from JustDanceRequests should appear in the chat.
7. Open / Close the Queue on the Live Configuration Page. A message from JustDanceRequests should appear in the chat.
