interface ImportConversationMessagesParams {
    conversationId: string;
    messages: Array<any>;
}

class ImportConversationMethods {
    /** @internal */
    private _request: any;

    /** @internal */
    constructor(request) {
        this._request = request;
    }

    async messages(params: ImportConversationMessagesParams) {
        const {
            conversationId,
            messages
        } = params;
        return this._request('post', `/import/conversations/${conversationId}/messages`, {
            body: messages
        });
    }
}

export default class ImportMethods {
    /** @internal */
    private _request: any;
    public conversations: ImportConversationMethods;

    /** @internal */
    constructor(request) {
        this._request = request;
        this.conversations = new ImportConversationMethods(this._request);
    }
}
