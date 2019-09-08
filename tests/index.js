const test = require('tape');
const sinon = require('sinon');
const {TalkJS, oneOnOneId} = require('../dist');

function wrapper(fn) {
    return async (t) => {
        let result;
        try {
            if (fn) {
                result = await setup();
                await fn({t, ...result});
            }
            t.pass('');
        } catch (e) {
            t.fail(e);
        } finally {
            t.end();
        }
    }
}

function setup() {
    const {
        TALKJS_APP_ID,
        TALKJS_API_KEY
    } = process.env;
    const client = new TalkJS({
        appId: TALKJS_APP_ID,
        apiKey: TALKJS_API_KEY
    });
    return {client};
}

test('users async generator', wrapper(async ({t, client}) => {
    const users = [];
    sinon.spy(client.users, '_request');

    for await (const user of client.users.list({limit: 1})) {
        users.push(user);
        if (users.length === 2) break;
    }
    
    t.equal(users.length, 2);
    t.equal(client.users._request.callCount, 2);
}));

test('users classic loop', wrapper(async ({t, client}) => {
    const users = [];
    sinon.spy(client.users, '_request');

    const generator = client.users.list({limit: 1});
    let user, done = false;
    while (({value: user, done} = await generator.next()) && !done) {
        users.push(user);
        if (users.length === 2) break;
    }

    t.equal(users.length, 2);
    t.equal(client.users._request.callCount, 2)
}));
