import {createHash} from 'crypto';
import got from 'got';
import UserMethods from './UserMethods';
import ConversationMethods from './ConversationMethods';
import ImportMethods from './ImportMethods';

function sha1(string) {
    const sha = createHash('sha1');
    sha.update(string);
    return sha.digest('hex');
}

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
    const hash = sha1(encoded);
    return hash.slice(0, 20);
}

interface TalkJSParams {
    baseUrl?: string;
    appId: string;
    apiKey: string;
}

export default class TalkJS {
    public users: UserMethods;
    public conversations: ConversationMethods;
    public import: ImportMethods;

    constructor(params: TalkJSParams) {
        const {
            appId,
            apiKey
        } = params;

        let {
            baseUrl = 'https://api.talkjs.com'
        } = params;

        baseUrl = baseUrl + `/v1/${appId}`;

        const client = got.extend({
            baseUrl,
            json: true,
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        async function request(method, url, options) {
            const resp = await client[method](url, options);
            return resp.body.data;
        };

        this.users = new UserMethods(request);
        this.conversations = new ConversationMethods(request);
        this.import = new ImportMethods(request);
    }
}
