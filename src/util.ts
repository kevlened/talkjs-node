export async function* paginate({request, url, query = {}} : {
    request: any,
    url: string,
    query?: any
}) {
    let startingAfter = query.startingAfter;
    query.limit = query.limit || 10;
    const nextPage = async () => {
        const results = await request('get', url, {
            query: {...query, startingAfter}
        });
        if (results.length === query.limit) startingAfter = results[results.length - 1].id;
        else startingAfter = null;
        return results;
    }

    let results = await nextPage();
    while (results.length) {
        yield results.shift();
        if (!results.length && startingAfter) results = await nextPage();
    }
}
