interface UserSessionListParams {
    userId: string;
}

class UserSessionMethods {
    /** @internal */
    private _request: any;

    /** @internal */
    constructor(request) {
        this._request = request;
    }

    async list(params: UserSessionListParams) {
        const {userId} = params;
        return this._request('get', `/users/${userId}/sessions`);
    }
}

interface UserConversationListParams {
    userId: string;
    limit?: number;
    startingAfter?: string;
    lastMessageAfter?: number;
    lastMessageBefore?: number;
    unreadsOnly?: boolean;
}

class UserConversationMethods {
    /** @internal */
    private _request: any;

    /** @internal */
    constructor(request) {
        this._request = request;
    }

    async list(params: UserConversationListParams) {
        const {
            userId,
            limit,
            startingAfter,
            lastMessageAfter,
            lastMessageBefore,
            unreadsOnly
        } = params;
        return this._request('get', `/users/${userId}/conversations`, {
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
    name?: string;
    email?: Array<string>;
    welcomeMessage?: string;
    photoUrl?: string;
    role?: string;
    phone?: Array<string>;
    custom?: Map<string, string>;
}

interface UserListParams {
    limit?: number;
    isOnline?: boolean;
    startingAfter?: string;
}

export default class UserMethods {
    /** @internal */
    private _request: any;
    public sessions: UserSessionMethods;
    public conversations: UserConversationMethods;

    /** @internal */
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

    async list(params: UserListParams) {
        const {limit, isOnline, startingAfter} = params;
        return this._request('get', '/users', {
            query: {
                limit,
                isOnline,
                startingAfter
            }
        });
    }
}
