export class ImportConversationMethods {
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

    async messages({conversationId, messages}: {
        conversationId: string;
        messages: Array<any>;
    }) {
        return this._request('post', `/import/conversations/${conversationId}/messages`, {
            body: messages
        });
    }
}

export default class ImportMethods {
    /**
        @internal
        @hidden
    */
    private _request: any;
    public conversations: ImportConversationMethods;

    /**
        @internal
        @hidden
    */
    constructor(request) {
        this._request = request;
        this.conversations = new ImportConversationMethods(this._request);
    }
}
