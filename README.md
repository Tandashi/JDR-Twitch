# Just Dance Requests - Twitch Extension

<p align="center">
  <a href="https://ko-fi.com/tandashi" target="_blank"><img src="https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white" /></a>
  <a href="https://twitter.com/JDR_Twitch" target="_blank"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>
  <a href="https://status.tandashi.de/status" target="_blank"><img src="https://img.shields.io/badge/Server%20Status%20Page-6F4C5B?style=for-the-badge&logo=Statuspage&logoColor=white" /></a>
  <a href="https://dashboard.twitch.tv/extensions/nv9ue0u2753fk3n1n9ghrvd28e3r9v" target="_blank"><img src="https://img.shields.io/badge/Twitch%20Extension%20Page-9146FF?style=for-the-badge&logo=twitch&logoColor=white" /></a>
</p>

## Why should I use this extension as a Just Dance Streamer ?

With this extension you can make it easier for your viewers to requests songs.  
They can search through all the songs directly on Twitch without visiting e.g. the Just Dance Wiki.  
A preview of the song as well as its stats (difficutly, effort, coach count) can also be seen in the extension.

You as a streamer can configure the extension with the game version (Just Dance 2016-2022), if you have Just Dance Unlimited as well as banning certain songs from being requested.

## Features

- 💃 Just Dance support from 2016 onwards including Just Dance Unlimited
- 🎥 Streamlabs / OBS integration
- 📱 Mobile Support (Android only)
- 💬 Chat Integration (Announcements in chat and commands like: !sr, !banlist, !leave)
- 🎬 Preview of the songs
- 🎨 Custom Theming for the Queue List
- and much more... 🚀

If you think there is anything missing then please see the [feature request](#feature-request) section for more information.


## Installation Guide

Installing the extension is super easy. All you have to do is head over to the [Twitch Extension Page](https://dashboard.twitch.tv/extensions/nv9ue0u2753fk3n1n9ghrvd28e3r9v) and click `Install`.  

After you have installed the extension you need to confiure it. A detailed configuration guide can be found in the [Wiki](https://github.com/Tandashi/JDR-Twitch/wiki/Configuration-Guide).



## Development Instructions

>⚠️ **Attention**: This section is only interesting to you if you are a developer and want to contribute to the project.

### Building the Extension

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

# Build minified (Will create extension.zip in dist/rollup/)
SERVER=prod yarn bundle-extension

# Bundles all source files needed for the Twitch Review process
SERVER=prod yarn bundle-sources

# Build non-minified
SERVER=prod yarn build

# Build with file watch
SERVER=prod yarn watch
```

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


## Contributing and Support

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change 🙏

### Questions / Support

To get support head over to the [discussions](https://github.com/Tandashi/JDR-Twitch/discussions) tab and create a new discussion as follows:

1. Select the category `Q&A`
2. Explain your problem

### Feature request

To create a feature request head over to the [discussions](https://github.com/Tandashi/JDR-Twitch/discussions) tab and create a new discussion as follows:

1. Select the category `Ideas`
2. Explain the feature

### Bug Reports

To create a bug report head over to the [issues](https://github.com/Tandashi/JDR-Twitch/issues) tab and create a new issue as follows:

1. Click on the Bug report template
2. Fill out as many points as you can
3. And your done :)

