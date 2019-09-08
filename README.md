# talkjs-node
A Node.js wrapper for the talkjs rest api

## Install

```
npm i talkjs-node

# or

yarn add talkjs-node
```

## Usage

```javascript
const TalkJS = require('talkjs-node').default;
// or
import TalkJS from 'talkjs-node';

const client = new TalkJS({
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_API_KEY'
});

(async function main() {
    // List the first 100 users
    const users = await client.users.list({limit: 100});
    for (const user of users)) {
        console.log(user.name);
    }
})();
```

A `oneOnOneId` generator [using the TalkJS recommendation](https://talkjs.com/docs/api/index.html#oneononeid) is included to generate a predictable conversation id for two participants.

```javascript
const {oneOnOneId} = require('talkjs-node');
// or
import {oneOnOneId} from 'talkjs-node';

console.log(oneOnOneId('userId1', 'userId2'));
```

## Methods

The methods match those provided by [the TalkJS REST api](https://talkjs.com/docs/Reference/REST_API/index.html).

* `oneOnOneId(userId1: string, userId2: string)`
* `client.import.conversations.messages({conversationId: string, messages: Array<Message>})`
* `client.users.create(userId: string, user: User)`
* `client.users.get(userId: string)`
* `client.users.update(userId: string, user: User)`
* `client.users.list({limit?: number, isOnline?: boolean, startingAfter?: string})`
* `client.users.sessions.list({userId: string})`
* `client.users.conversations.list({userId: string, limit?: number, startingAfter?: string, lastMessageAfter?: number, lastMessageBefore?: number, unreadsOnly?: boolean})`
* `client.conversations.create(conversationId: string, conversation: Conversation)`
* `client.conversations.get(conversationId: string)`
* `client.conversations.update(conversationId: string, conversation: Conversation)`
* `client.conversations.list({limit?: number, startingAfter?: string, lastMessageAfter?: number, lastMessageBefore?: number, filter?: Map<string, any>})`
* `client.conversations.notifications.send(conversationId: string, notification: Notification)`
* `client.conversations.messages.send(conversationId: string)`
* `client.conversations.messages.get(conversationId: string)`
* `client.conversations.messages.update(conversationId: string)`
* `client.conversations.messages.list(conversationId: string)`
* `client.conversations.participants.add({conversationId: string, userId: string, details: Map<string, any>})`
* `client.conversations.participants.update({conversationId: string, userId: string, details: Map<string, any>})`
* `client.conversations.participants.delete({conversationId: string, userId: string})`
* `client.conversations.participants.list({limit?: number, startingAfter?: string, lastMessageAfter?: number, lastMessageBefore?: number, filter?: Map<string, any>})`

## License

MIT
