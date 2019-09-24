import {paginate} from './util';

class UserSessionMethods {
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

    async *list({userId}: {userId: string;}) {
        yield* paginate({
            request: this._request,
            url: `/users/${userId}/sessions`
        });
    }
}

class UserConversationMethods {
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

    async *list({
        userId,
        limit = 10,
        startingAfter,
        lastMessageAfter,
        lastMessageBefore,
        unreadsOnly
    }: {
        userId: string;
        limit?: number;
        startingAfter?: string;
        lastMessageAfter?: number;
        lastMessageBefore?: number;
        unreadsOnly?: boolean;
    }) {
        yield* paginate({
            request: this._request,
            url: `/users/${userId}/conversations`,
            query: {
                limit,
                unreadsOnly,
                startingAfter,
                lastMessageAfter,
                lastMessageBefore
            }
        });
    }
}

interface User {
    name: string;
    welcomeMessage?: string;
    photoUrl?: string;
    role?: string;
    email?: Array<string>;
    phone?: Array<string>;
    custom?: Map<string, string>;
    locale?: string;
}

export default class UserMethods {
    /**
        @internal
        @hidden
    */
    private _request: any;
    public sessions: UserSessionMethods;
    public conversations: UserConversationMethods;

    /**
        @internal
        @hidden
    */
    constructor(request) {
        this._request = request;
        this.sessions = new UserSessionMethods(this._request);
        this.conversations = new UserConversationMethods(this._request);
    }

    async create(userId: string, user: User) {
        return this.update(userId, user);
    }

    async get(userId: string) {
        return this._request('get', `/users/${userId}`);
    }

    async update(userId: string, user: User) {
        return this._request('put', `/users/${userId}`, {
            body: user
        });
    }

    async *list({limit = 10, isOnline, startingAfter}: {
        limit?: number;
        isOnline?: boolean;
        startingAfter?: string;
    } = {}) {
        yield* paginate({
            request: this._request,
            url: '/users',
            query: {
                limit,
                isOnline,
                startingAfter
            }
        });
    }
}
