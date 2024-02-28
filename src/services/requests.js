import { getAuth } from '../util';


// export const fetchData = async (offset, filter) => {
//     const params = new Map();
    
//     if (filter.brand.trim().length > 0) {
//         params.set("brand", filter.brand.trim())
//     }
//     if (filter.price > 0) {
//         params.set("price", filter.price)
//     }
//     if (filter.product.trim().length > 0) {
//         params.set("product", filter.product.trim())
//     }

//     let ids = params.size > 0 ?
//               await fetchFilteredIds(params) :
//               Array.from(await fetchIds(offset, LIMIT));
//     return await fetchItems(Array.from(ids));
// }

// const fetchIds = async (offset, limit) => {
//     const body = JSON.stringify(
//         {
//             action: "get_ids",
//             params: {
//                 offset: offset * limit,
//                 limit: limit
//             }
//         }
//     );
//     let ids = new Set(await toRequest(body));
    
//     if (ids.size < limit) {
//         // collect differences
//         (await fetchIds(offset + ids.size + 1, limit - ids.size))
//             .forEach(item => {
//                 ids.add(item);
//             });
//     }
//     return ids;
// }

// const fetchFilteredIds = async (filter) => {
//     const requestsArr = [];
//     const idsMap = new Map();
//     filter.forEach((value, key) => {
//         const body = JSON.stringify(
//             {
//                 action: "filter",
//                 params: {
//                     [key]: value
//                 }
//             }
//         );
//         const ids = toRequest(body)
//             .then(ids => {
//                 ids.forEach(item => {
//                     if (!idsMap.has(item)) {
//                         idsMap.set(item, 1);
//                     } else {
//                         idsMap.set(item, idsMap.get(item)+1);
//                     }
//                 });
//             });
//         requestsArr.push(ids);
//     })
    
//     await Promise.all(requestsArr);
//     const arrIds = [];
//     idsMap.forEach((value, key) => {
//         if (value === filter.size) arrIds.push(key)
//     });
//     return arrIds;
// }

// const fetchItems = async (ids) => {
//     const body = JSON.stringify(
//         {
//             action: "get_items",
//             params: { ids }
//         }
//     );
//     return await toRequest(body);
// }

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
    console.log(response.status)
    return await toRequest(body);
}
