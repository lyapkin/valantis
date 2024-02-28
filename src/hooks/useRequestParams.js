import { useReducer } from "react";
import requestParamsReducer, { CHANGE_OFFSET_ERROR, requestParamsInitState } from "../reducers/requestParamsReducer";
import { LIMIT } from "../const";
import { toRequest } from "../services/requests";

export const useRequestData = () => {
    const [params, dispatch] = useReducer(requestParamsReducer, requestParamsInitState);

    const fetchData = async () => {
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
        
        let ids;
        if (filter.size > 0) {
            ids = await fetchFilteredIds(filter);
        } else {
            const idsSet = new Set();
            let offsetAccumulator = {error: params.pagination.offsetError};
            ids = Array.from(await fetchIds(params.pagination.page * LIMIT + params.pagination.offsetError,
                                            LIMIT, LIMIT, idsSet, offsetAccumulator));
            if (offsetAccumulator.error > params.pagination.offsetError) {
                dispatch({type: CHANGE_OFFSET_ERROR, payload: offsetAccumulator.error});
            }
        }
        let set = new Set();
        return (await fetchItems(ids)).filter(item => {
            if (set.has(item.id)) return false;
            set.add(item.id);
            return true;
        });
    }

    const fetchIds = async (offset, requestLimit, LIMIT, receivedUniqueIds, offsetAccumulator) => {
        const body = JSON.stringify(
            {
                action: "get_ids",
                params: {
                    offset,
                    limit: requestLimit
                }
            }
        );
        (await toRequest(body)).forEach(item => receivedUniqueIds.add(item));
        
        if (receivedUniqueIds.size < LIMIT) {
            offsetAccumulator.error += (requestLimit - receivedUniqueIds.size);
            await fetchIds(offset + receivedUniqueIds.size + 1, requestLimit - receivedUniqueIds.size,
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
    
    const fetchItems = async (ids) => {
        const body = JSON.stringify(
            {
                action: "get_items",
                params: { ids }
            }
        );
        return await toRequest(body);
    }

    return [params.pagination.page+1, params.filter, dispatch, fetchData]
}