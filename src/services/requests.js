import { getAuth } from '../utils/util';


export const toRequest = async body => {
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
    console.log("Ошибка id:", await response.text());
    return await toRequest(body);
}

export const fetchUnfilteredIds = async (offset, requestLimit, LIMIT, receivedUniqueIds, offsetAccumulator) => {
    const body = JSON.stringify(
        {
            action: "get_ids",
            params: {
                offset,
                limit: requestLimit
            }
        }
    );
    const idsArr = await toRequest(body);
    idsArr.forEach(item => receivedUniqueIds.add(item));
    
    if (idsArr < requestLimit) {
        return receivedUniqueIds;
    }
    
    if (receivedUniqueIds.size < LIMIT) {
        offsetAccumulator.error += (requestLimit - receivedUniqueIds.size);
        await fetchUnfilteredIds(offset + receivedUniqueIds.size + 1, requestLimit - receivedUniqueIds.size,
                       LIMIT, receivedUniqueIds, offsetAccumulator);
    }
    
    return receivedUniqueIds;
}

export const fetchFilteredIds = async (filter) => {
    const requestsArr = [];
    const idsMap = new Map();
    filter.forEach((value, key) => {
        const body = JSON.stringify(
            {
                action: "filter",
                params: {
                    [key]: value
                }
            }
        );
        const ids = toRequest(body)
            .then(ids => {
                ids.forEach(item => {
                    if (!idsMap.has(item)) {
                        idsMap.set(item, 1);
                    } else {
                        idsMap.set(item, idsMap.get(item)+1);
                    }
                });
            });
        requestsArr.push(ids);
    })
    
    await Promise.all(requestsArr);
    const arrIds = [];
    idsMap.forEach((value, key) => {
        if (value === filter.size) arrIds.push(key)
    });
    return arrIds;
}