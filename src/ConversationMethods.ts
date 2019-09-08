import {paginate} from './util';

export class ConversationNotificationMethods {
    /**
        @internal
        @hidden
    */
    private _request: any;

    /**
        @internal
        @hidden
    */
    constructor(request) {
        this._request = request;
    }

    async send({conversationId, notification}: {
        conversationId: string;
        notification: Map<string, any>;
    }) {
        return this._request('post', `/conversations/${conversationId}/notifications`, {
            body: notification
        });
    }
}

enum MessageType {
    UserMessage = "UserMessage",
    SystemMessage = "SystemMessage"
}

interface Message {
    text: string;
    sender?: string;
    type: MessageType;
    attachmentToken?: string;
    custom?: Map<string, any>;
}

export class ConversationMessageMethods {
    /**
        @internal
        @hidden
    */
    private _request: any;

    /**
        @internal
        @hidden
    */
    constructor(request) {
        this._request = request;
    }

    async send({conversationId, messages}: {
        conversationId: string;
        messages: Array<Message>;
    }) {
        return this._request('post', `/conversations/${conversationId}/messages`, {
            body: messages
        });
    }

    async get(conversationId: string, messageId: string) {
        return this._request('get', `/conversations/${conversationId}/messages/${messageId}`);
    }

    async update({conversationId, messageId, message}: {
        conversationId: string;
        messageId: string;
        message: Map<string, any>;
    }) {
        return this._request('post', `/conversations/${conversationId}/messages/${messageId}`, {
            body: message
        });
    }

    async *list({conversationId, limit, startingAfter}: {
        conversationId: string;
        limit?: number;
        startingAfter?: string;
    }) {
        yield* paginate({
            request: this._request,
            url: `/conversations/${conversationId}/messages`,
            query: {
                limit,
                startingAfter
            }
        });
    }
}

class ConversationParticipantMethods {
    /**
        @internal
        @hidden
    */
    private _request: any;

    /**
        @internal
        @hidden
    */
    constructor(request) {
        this._request = request;
    }

    async add({conversationId, userId, details}: {
        conversationId: string;
        userId: string;
        details: Map<string, any>;
    }) {
        return this._request('put', `/conversations/${conversationId}/participants/${userId}`, {
            body: details
        });
    }

    async update({conversationId, userId, details}: {
        conversationId: string;
        userId: string;
        details: Map<string, any>;
    }) {
        return this._request('patch', `/conversations/${conversationId}/participants/${userId}`, {
            body: details
        });
    }

    async remove({conversationId, userId}: {
        conversationId: string;
        userId: string;
    }) {
        return this._request('delete', `/conversations/${conversationId}/participants/${userId}`);
    }
}

interface Conversation {
    id?: string;
    participants?: Map<string, Map<string, string>>;
    subject?: string;
    welcomeMessages?: Array<string>;
    photoUrl?: string;
    custom?: Map<string, string>;
}

export default class ConversationMethods {
    /**
        @internal
        @hidden
    */
    private _request: any;
    public notifications: ConversationNotificationMethods;
    public messages: ConversationMessageMethods;
    public participants: ConversationParticipantMethods;

    /**
        @internal
        @hidden
    */
    constructor(request) {
        this._request = request;
        this.notifications = new ConversationNotificationMethods(this._request);
        this.messages = new ConversationMessageMethods(this._request);
        this.participants = new ConversationParticipantMethods(this._request);
    }

    async create(conversationId: string, conversation: Conversation) {
        return this.update(conversationId, conversation);
    }

    async get(conversationId: string) : Promise<Conversation> {
        return this._request('get', `/conversations/${conversationId}`);
    }

    async update(conversationId: string, conversation: Conversation) {
        return this._request('put', `/conversations/${conversationId}`, {
            body: conversation
        });
    }

    async *list({limit, startingAfter, lastMessageAfter, lastMessageBefore, filter}: {
        limit?: number;
        startingAfter?: string;
        lastMessageAfter?: number;
        lastMessageBefore?: number;
        filter?: Map<string, any>;
    }) : AsyncGenerator<Conversation> {
        const query = {
            limit,
            startingAfter,
            lastMessageAfter,
            lastMessageBefore,
            filter: undefined
        };
        if (filter) query.filter = encodeURIComponent(JSON.stringify(filter));
        yield* paginate({
            request: this._request,
            url: '/conversations',
            query
        });
    }
}
