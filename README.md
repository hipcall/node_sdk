# Hipcall Node.js SDK (`@hipcall/sdk`)

> **Language / Dil:** **English** | [Türkçe (`README_TR.md`)](./README_TR.md)

Official Hipcall REST API Wrapper written in TypeScript for Node.js.

> Looking for the browser WebRTC & SIP softphone SDK? See [**Hipcall WebRTC SDK (`@hipcall/webrtc-sdk`)**](https://github.com/hipcall/node_webrtc_sdk).

## Installation

```bash
npm install @hipcall/sdk
# or
yarn add @hipcall/sdk
# or
pnpm add @hipcall/sdk
```

## Quick Start

Import `HipcallClient` (or `Client`) and initialize it with your Hipcall API token:

```ts
import { HipcallClient } from '@hipcall/sdk';

const client = new HipcallClient({
  apiKey: process.env.HIPCALL_API_TOKEN!,
  // Optional: defaults to "https://use.hipcall.com.tr"
  baseUrl: 'https://use.hipcall.com',
});

// List recent calls
const calls = await client.getCalls(10, 0);
console.log(calls.data);

// Initiate an outbound click-to-call (Call & Bridge)
const bridge = await client.callAndBridge(
  4200,
  '+905300000000',
  true,
  true,
  'Support Team'
);
console.log('Call UUID:', bridge.data.id);

// Create a task
const task = await client.createTask({
  name: 'Follow up with customer',
  description: 'Call back regarding invoice',
  priority: 'high',
});
console.log('Created task ID:', task.data.id);
```

Both `camelCase` (`client.getCalls()`) and `snake_case` (`client.get_calls()`) method names are supported on the client instance.

## Error Handling

The SDK maps HTTP error responses to typed exception classes:

```ts
import {
  HipcallClient,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
  HipcallAPIException,
} from '@hipcall/sdk';

const client = new HipcallClient(process.env.HIPCALL_API_TOKEN!);

try {
  const user = await client.getUser(999999);
} catch (err) {
  if (err instanceof NotFoundException) {
    console.error('User not found:', err.message);
  } else if (err instanceof UnauthorizedException) {
    console.error('Invalid API key');
  } else if (err instanceof UnprocessableEntityException) {
    console.error('Validation errors:', err.errors);
  } else if (err instanceof BadRequestException) {
    console.error('Bad request:', err.detail);
  } else if (err instanceof HipcallAPIException) {
    console.error(`API error (${err.statusCode}):`, err.content);
  }
}
```

## Supported Modules & Roadmap

- [x] Task (`getTasks`, `createTask`, `getTask`, `updateTask`, comments & tags)
- [x] Phone system - call (`getCalls`, `getCall`, `callAndBridge`, `createCallCard`, `getCallCards`, comments, tags & dispositions)
- [x] Phone system - extensions (`getExtensions`, `getExtension`, `callExtension`)
- [x] Phone system - greetings (`getGreetings`, `getGreeting`)
- [x] Phone system - numbers (`getNumbers`, `getNumber`)
- [x] Phone system - teams (`getTeams`, `getTeam`)
- [x] Phone system - users (`getUsers`, `getUser`, `updateUser`, `getUserTodayStats`)
- [x] Phone system - voicemails (`getVoicemails`, `getVoicemail`)
- [x] Contact centre (`getContacts`, `createContact`, `getCompanies`, `createCompany`, `lookupByPhone`, `lookupByEmail`, consents, custom fields)
- [x] Inbox (`getInboxes`, `getConversations`, `sendTextMessage`, `sendTemplateMessage`)
- [x] Sales (`getDeals`, `getDeal`, `getDealComments`, `createDealComment`)
- [x] Account (`getProfile`, `getProfileTodayStats`, `createSipToken`, mobile devices & push tokens)

## Development

```bash
# Install dependencies
npm install

# Type-check and build
npm run build

# Run test suite
npm test
```

## All Hipcall Libraries

- [HipcallNodeSdk](https://github.com/hipcall/node_sdk) - Official Hipcall API Wrapper written in TypeScript/Node.js.
- [HipcallNodeWebrtcSdk](https://github.com/hipcall/node_webrtc_sdk) - Official Hipcall WebRTC & SIP JavaScript/TypeScript SDK.
- [HipcallPythonSdk](https://github.com/hipcall/python_sdk) - Official Hipcall API Wrapper written in Python.
- [HipcallRubySdk](https://github.com/hipcall/ruby-sdk) - Official Hipcall API Wrapper written in Ruby.
- [HipcallSdk](https://github.com/hipcall/elixir_sdk) - Official Hipcall API Wrapper written in Elixir.

## License

[MIT](./LICENSE)
