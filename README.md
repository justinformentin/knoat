# Knoat

***Work in Progress***

Visit the site: [https://knoat.com](https://knoat.com)

Simple Gmail client built using [React](https://github.com/facebook/react) and [Redux](https://github.com/reduxjs/redux). Pulls data from [Gmail's RESTful API](https://developers.google.com/gmail/api/).

## How it works

**Authentication** - entirely handled by Gmail for security

**Data** - Knoat doesn't store or persist any user or account data. The application only fetches the data from Gmail's API.

**Features** - Read, Reply, Send, and Delete emails.

## UI Flow

1. Users will see a page with a button to sign in.

2. Once signed-in, a popup screen from Gmail will ask the user for permission.

3. Inbox will load with all messages.

## Usage

**API Keys** - All requests from Gmail's API require an OAuth 2.0 Client ID as well as an API Key. You can create a project and get these credentials from [Google's Cloud Platform](https://console.cloud.google.com/apis) or read more and follow the links in Google's [Node.js Quickstart Guide](https://developers.google.com/gmail/api/quickstart/nodejs).

Store the two credential values in an `.env` file in the root directory. An example of this can be found in `.envsample`.