interface ConversationNotificationSendParams {
    conversationId: string;
    notification: Map<string, any>;
}

class ConversationNotificationMethods {
    /** @internal */
    private _request: any;

    /** @internal */
    constructor(request) {
        this._request = request;
    }

    async send(params: ConversationNotificationSendParams) {
        const {conversationId, notification} = params;
        return this._request('post', `/conversations/${conversationId}/notifications`, {
            body: notification
        });
    }
}

interface ConversationMessageListParams {
    conversationId: string;
    limit?: number;
}

class ConversationMessageMethods {
    /** @internal */
    private _request: any;

    /** @internal */
    constructor(request) {
        this._request = request;
    }

    async list(params: ConversationMessageListParams) {
        const {
            conversationId,
            limit
        } = params;
        return this._request('get', `/conversations/${conversationId}/messages`, {
            query: {
                limit
            }
        });
    }
}

interface ConversationParticipantAddParams {
    conversationId: string;
    userId: string;
    details: Map<string, any>;
}

interface ConversationParticipantUpdateParams {
    conversationId: string;
    userId: string;
    details: Map<string, any>;
}

interface ConversationParticipantDeleteParams {
    conversationId: string;
    userId: string;
}

class ConversationParticipantMethods {
    /** @internal */
    private _request: any;

    /** @internal */
    constructor(request) {
        this._request = request;
    }

    async add(params: ConversationParticipantAddParams) {
        const {conversationId, userId, details} = params;
        return this._request('put', `/conversations/${conversationId}/notifications/${userId}`, {
            body: details
        });
    }

    async update(params: ConversationParticipantUpdateParams) {
        const {conversationId, userId, details} = params;
        return this._request('patch', `/conversations/${conversationId}/notifications/${userId}`, {
            body: details
        });
    }

    async delete(params: ConversationParticipantDeleteParams) {
        const {conversationId, userId} = params;
        return this._request('delete', `/conversations/${conversationId}/notifications/${userId}`);
    }

    async list(params: ConversationListParams) {
        const {limit, startingAfter, lastMessageAfter, lastMessageBefore, filter} = params;
        const query = {
            limit,
            startingAfter,
            lastMessageAfter,
            lastMessageBefore,
            filter: undefined
        };
        if (filter) query.filter = encodeURIComponent(JSON.stringify(filter));
        return this._request('get', '/conversations', {query});
    }
}

interface Conversation {
    subject?: string;
    welcomeMessages?: Array<string>;
    photoUrl?: string;
    custom?: Map<string, string>;
}

interface ConversationListParams {
    limit?: number;
    startingAfter?: string;
    lastMessageAfter?: number;
    lastMessageBefore?: number;
    filter?: Map<string, any>;
}

export default class ConversationMethods {
    /** @internal */
    private _request: any;
    public notifications: ConversationNotificationMethods;
    public messages: ConversationMessageMethods;
    public participants: ConversationParticipantMethods;

    /** @internal */
    constructor(request) {
        this._request = request;
        this.notifications = new ConversationNotificationMethods(this._request);
        this.messages = new ConversationMessageMethods(this._request);
        this.participants = new ConversationParticipantMethods(this._request);
    }

    async create(conversationId: string, conversation: Conversation) {
        return this.update(conversationId, conversation);
    }

    async get(conversationId: string) {
        return this._request('get', `/conversations/${conversationId}`);
    }

    async update(conversationId: string, conversation: Conversation) {
        return this._request('put', `/conversations/${conversationId}`, {
            body: conversation
        });
    }

    async list(params: ConversationListParams) {
        const {limit, startingAfter, lastMessageAfter, lastMessageBefore, filter} = params;
        const query = {
            limit,
            startingAfter,
            lastMessageAfter,
            lastMessageBefore,
            filter: undefined
        };
        if (filter) query.filter = encodeURIComponent(JSON.stringify(filter));
        return this._request('get', '/conversations', {query});
    }
}
