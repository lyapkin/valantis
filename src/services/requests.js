import { getAuth } from '../util';

const LIMIT = 50;


export const fetchData = async (offset, filter) => {
    const params = new Map();
    
    if (filter.brand.trim().length > 0) {
        params.set("brand", filter.brand.trim())
    }
    if (filter.price > 0) {
        params.set("price", filter.price)
    }
    if (filter.product.trim().length > 0) {
        params.set("product", filter.product.trim())
    }

    const resultIds = await fetchIds(offset, params);
    const ids = resultIds;
    const resultItems = await fetchItems(ids);
    return resultItems;
}

const fetchIds = async (offset, params) => {
    if (params.size > 0) {
        return await fetchFilteredIds(params);
    } else {
        const body = JSON.stringify(
            {
                action: "get_ids",
                params: {
                    offset: offset * LIMIT,
                    limit: LIMIT
                }
            }
        );
        return await request(body);
    }
}

const fetchFilteredIds = async (filter) => {
    const idsMap = new Map();
    for (let entry of filter) {
        const body = JSON.stringify(
            {
                action: "filter",
                params: {
                    [entry[0]]: entry[1]
                }
            }
        );
        const ids = await request(body);
        console.log("wait")
        ids.forEach(item => {
            if (!idsMap.has(item)) {
                idsMap.set(item, 1);
            } else {
                idsMap.set(item, idsMap.get(item)+1);
            }
        });
    }

    const arrIds = [];
    idsMap.forEach((value, key) => {
        if (value === filter.size) arrIds.push(key)
    });
    return arrIds;
}

const fetchItems = async (ids) => {
    const body = JSON.stringify(
        {
            action: "get_items",
            params: { ids }
        }
    );
    return await request(body);
}

const request = async body => {
    const response = await fetch("http://api.valantis.store:40000/", {
        headers: {
            "X-Auth": getAuth(),
            "Content-Type": "application/json"
        },
        method: "POST",
        body
    });
    if (response.ok) {
        return (await response.json()).result;
    }
    console.log(response.status)
    return await request(body);
}
