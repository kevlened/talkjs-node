const got = require('got');
import {createHash} from 'crypto';
import UserMethods from './UserMethods';
import ConversationMethods from './ConversationMethods';
import ImportMethods from './ImportMethods';

/**
 * A helper method to predictably compute a Conversation ID
 * based on participants' ids in the given conversation.
 *
 * @param userId1 - The id of the first participant
 * @param userId2 - The id of the second participant
 */
export function oneOnOneId(userId1: string, userId2: string) {
    const sorted = [userId1, userId2].sort();
    const encoded = JSON.stringify(sorted);

    // Calculate the sha1
    const sha = createHash('sha1');
    sha.update(encoded);
    const hash = sha.digest('hex');

    return hash.slice(0, 20);
}

// BREAKING: remove the default
export default class TalkJS {
    public users: UserMethods;
    public conversations: ConversationMethods;
    public import: ImportMethods;

    constructor({
        baseUrl = 'https://api.talkjs.com',
        appId,
        apiKey
    } : {
        baseUrl?: string;
        appId: string;
        apiKey: string;
    }) {
        baseUrl = baseUrl + `/v1/${appId}`;

        const client = got.extend({
            baseUrl,
            json: true,
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        async function request(method, url, options) {
            try {
                const resp = await client[method](url, options);
                return resp.body.data || resp.body;
            } catch (e) {
                console.log(e.body);
                throw e;
            }
        };

        this.users = new UserMethods(request);
        this.conversations = new ConversationMethods(request);
        this.import = new ImportMethods(request);
    }
}
