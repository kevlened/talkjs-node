const crypto = require('crypto');
const got = require('got');

function sha1(string) {
    const sha = crypto.createHash('sha1');
    sha.update(string);
    return sha.digest('hex');
}

function oneOnOneId(userId1, userId2) {
    const sorted = [userId1, userId2].sort();
    const encoded = JSON.stringify(sorted);
    const hash = sha1(encoded);
    return hash.slice(-20);
}

class TalkJS {
    constructor({
        baseUrl = 'https://api.talkjs.com',
        appId,
        apiKey
    } = {}) {
        const client = got.extend({
            baseUrl,
            json: true,
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        function get(url, options) {
            const resp = await client.get(url, options);
            return resp.body.data;
        }

        function put(url, options) {
            const resp = await client.put(url, options);
            return resp.body.data;
        }

        function post(url, options) {
            const resp = await client.post(url, options);
            return resp.body.data;
        }

        function patch(url, options) {
            const resp = await client.patch(url, options);
            return resp.body.data;
        }

        function del(url, options) {
            const resp = await client.delete(url, options);
            return resp.body.data;
        }

        Object.assign(this, {
            users: {
                async create(userId, user) {
                    return this.users.update(userId, user);
                },

                async get(userId) {
                    return get(`/v1/${appId}/users/${userId}`);
                },
    
                async update(userId, user) {
                    return put(`/v1/${appId}/users/${userId}`, {
                        body: user
                    });
                },
    
                async list({limit, isOnline, startingAfter} = {}) {
                    return get(`/v1/${appId}/users`, {
                        query: {
                            limit,
                            isOnline,
                            startingAfter
                        }
                    });
                },

                sessions: {
                    async list({userId} = {}) {
                        return get(`/v1/${appId}/users/${userId}/sessions`);
                    }
                },

                conversations: {
                    async list({userId, limit, startingAfter, lastMessageAfter, lastMessageBefore, unreadsOnly} = {}) {
                        return get(`/v1/${appId}/users/${userId}/conversations`, {
                            query: {
                                limit,
                                unreadsOnly,
                                startingAfter,
                                lastMessageAfter,
                                lastMessageBefore
                            }
                        });
                    },
                }
            },

            conversations: {
                async create(conversationId, conversation) {
                    return this.conversations.update(conversationId, conversation);
                },
                
                async get(conversationId) {
                    return get(`/v1/${appId}/conversations/${conversationId}`);
                },
    
                async update(conversationId, conversation) {
                    return put(`/v1/${appId}/conversations/${conversationId}`, {
                        body: conversation
                    });
                },
    
                async list({limit, startingAfter, lastMessageAfter, lastMessageBefore, filter} = {}) {
                    const query = {
                        limit,
                        startingAfter,
                        lastMessageAfter,
                        lastMessageBefore
                    };
                    if (filter) query.filter = encodeURIComponent(JSON.stringify(filter));
                    return get(`/v1/${appId}/conversations`, {query});
                },
    
                messages: {
                    async list({conversationId, limit} = {}) {
                        return get(`/v1/${appId}/conversations/${conversationId}/messages`, {
                            query: {
                                limit
                            }
                        });
                    },
                },
    
                notifications: {
                    async send({conversationId, notification}) {
                        return post(`/v1/${appId}/conversations/${conversationId}/notifications`, {
                            body: notification
                        });
                    },
                },

                participants: {
                    async add({conversationId, userId, details}) {
                        return put(`/v1/${appId}/conversations/${conversationId}/notifications/${userId}`, {
                            body: details
                        });
                    },
        
                    async update({conversationId, userId, details}) {
                        return patch(`/v1/${appId}/conversations/${conversationId}/notifications/${userId}`, {
                            body: details
                        });
                    },
        
                    async delete({conversationId, userId}) {
                        return del(`/v1/${appId}/conversations/${conversationId}/notifications/${userId}`);
                    },
                }
            },

            import: {
                conversations: {
                    async messages({conversationId, messages}) {
                        return post(`/v1/${appId}/import/conversations/${conversationId}/messages`, {
                            body: messages
                        });
                    }
                }
            }
        });
    }
}

module.exports = {TalkJS, oneOnOneId};
