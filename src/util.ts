export async function* paginate({request, url, query = {}} : {
    request: any,
    url: string,
    query?: any
}) {
    let startingAfter = query.startingAfter;
    const nextPage = async () => {
        const results = await request('get', url, {query});
        if (query.limit && results.length === query.limit) startingAfter = results[results.length - 1].id;
        else startingAfter = null;
        return results;
    }

    let results = await nextPage();
    while (results.length) {
        yield results.shift();
        if (!results.length && startingAfter) results = await nextPage();
    }
}
