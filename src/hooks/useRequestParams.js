import { useEffect, useReducer, useState } from "react";
import requestParamsReducer, { CHANGE_OFFSET_ERROR, requestParamsInitState } from "../reducers/requestParamsReducer";
import { LIMIT } from "../const";
import { toRequest } from "../services/requests";

export const useRequestData = () => {
    const [params, dispatch] = useReducer(requestParamsReducer, requestParamsInitState);
    const [ids, setIds] = useState({});

    const fetchIds = async () => {
        let key = params.filter.brand + params.filter.price + params.filter.product + "";
        if ((key in ids) && (ids[key].length > params.pagination.page * LIMIT)) {
            return ids[key].slice(params.pagination.page*LIMIT, params.pagination.page*LIMIT + LIMIT);
        }
        
        const filter = new Map();
        
        if (params.filter.brand.trim().length > 0) {
            filter.set("brand", params.filter.brand.trim())
        }
        if (params.filter.price > 0) {
            filter.set("price", params.filter.price)
        }
        if (params.filter.product.trim().length > 0) {
            filter.set("product", params.filter.product.trim())
        }
        
        let receivedIds;
        if (filter.size > 0) {
            receivedIds = await fetchFilteredIds(filter);
        } else {
            const idsSet = new Set();
            let offsetAccumulator = {error: params.pagination.offsetError};
            receivedIds = Array.from(await fetchUnfilteredIds(params.pagination.page * LIMIT + params.pagination.offsetError,
                                            LIMIT, LIMIT, idsSet, offsetAccumulator));
            if (offsetAccumulator.error > params.pagination.offsetError) {
                dispatch({type: CHANGE_OFFSET_ERROR, payload: offsetAccumulator.error});
            }
        }

        if (key in ids) {
            setIds(prevState => {
                return {
                    [key]: prevState[key].concat(receivedIds)
                }
            })
        } else {
            setIds({[key]: receivedIds});
        }
        
        return receivedIds.slice(0, LIMIT);
    }

    const fetchUnfilteredIds = async (offset, requestLimit, LIMIT, receivedUniqueIds, offsetAccumulator) => {
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
    
    const fetchFilteredIds = async (filter) => {
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
    

    return [params.pagination.page+1, params.filter, dispatch, fetchIds]
}