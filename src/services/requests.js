import { getAuth } from '../util';

const LIMIT = 50;


export const fetchData = async (offset, filter) => {
    const params = {};
    
    if (filter.price > 0) {
        params.price = filter.price
    }
    if (Boolean(filter.brand.trim())) {
        params.brand = filter.brand.trim()
    }
    if (Boolean(filter.product.trim())) {
        params.product = filter.product.trim()
    }

    const resultIds = await fetchIds(offset, params);
    const ids = resultIds.result;
    const resultItems = await fetchItems(ids);
    return resultItems.result;
}

const fetchIds = async (offset, params) => {
    let body;
    if (params.hasOwnProperty("product")|| 
        params.hasOwnProperty("price") ||
        params.hasOwnProperty("brand"))
    {
        body = JSON.stringify(
            {
                action: "filter",
                params
            }
        )
    } else {
        body = JSON.stringify(
            {
                action: "get_ids",
                params: {
                    offset: offset * LIMIT,
                    limit: LIMIT
                }
            }
        )
    }

    return await request(body)
}

const fetchFilteredIds = async (filter) => {
    const idsMap = new Map()
    for (let key in filter) {
        const body = JSON.stringify(
            {
                action: "filter",
                params: {
                    [key]: filter[key]
                }
            }
        )
        const ids = await request(body);
        idsMap.set(key, new Set(ids))
    }
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
    })
    if (response.ok) {
        return await response.json();
    }
    console.log(response.status)
    return await request(body)
}
