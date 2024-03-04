import { useEffect, useReducer, useRef, useState } from "react";
import { LIMIT } from "../utils/const";
import { fetchFilteredIds, fetchUnfilteredIds, toRequest } from "../services/requests";
import idsReducer, { PUSH_IDS, SET_IDS, idsInitState } from "../reducers/idsReducer";

const useData = (page, productFilter) => {
    const keyRef = useRef(productFilter.brand + productFilter.price + productFilter.product + "");
    const [ids, dispatch] = useReducer(idsReducer, idsInitState);
    const [allData, setAllData] = useState(false);
    const [productList, setProductList] = useState([]);
    const [offsetError, setOffsetError] = useState(0);

    const [loading, setLoading] = useState(false);
    
    const fetchIds = async () => {
        const key = productFilter.brand + productFilter.price + productFilter.product + "";
        if ((key in ids) && ( (ids[key].length-LIMIT > page * LIMIT) || allData )) {
            return ids[key].slice(page*LIMIT, page*LIMIT + LIMIT);
        }
        
        const filter = new Map();
        
        if (productFilter.brand.trim().length > 0) {
            filter.set("brand", productFilter.brand.trim())
        }
        if (productFilter.price > 0) {
            filter.set("price", Number(productFilter.price))
        }
        if (productFilter.product.trim().length > 0) {
            filter.set("product", productFilter.product.trim())
        }
        
        let receivedData;
        if (filter.size > 0) {
            receivedData = await fetchFilteredIds(filter);
        } else {
            let limit = LIMIT;
            let offset = page * LIMIT + offsetError + 50;
            if (page === 0) {
                limit *= 2;
                offset -= 50;
            }
            const idsSet = new Set();
            let offsetAccumulator = {error: offsetError};
            receivedData = await fetchUnfilteredIds(offset, limit, limit, 
                                                    idsSet, offsetAccumulator);
            if (offsetAccumulator.error > offsetError) {
                setOffsetError(offsetAccumulator.error);
            }
        }
        
        if (allData !== receivedData.allData) {
            setAllData(receivedData.allData);
        }

        if (key in ids) {
            dispatch({type: PUSH_IDS, payload: {[key]: receivedData.ids}});
        } else {
            dispatch({type: SET_IDS, payload: {[key]:receivedData.ids}});
            keyRef.current = key;
        }

        const result = (page === 0) ? receivedData.ids : ids[key];
        
        return result.slice(page*LIMIT, page*LIMIT + LIMIT);
    }

    const fetchProducts = async (ids) => {
        const body = JSON.stringify(
            {
                action: "get_items",
                params: { ids }
            }
        );

        const set = new Set();
        const items = (await toRequest(body)).filter(item => {
            if (set.has(item.id)) return false;
            set.add(item.id);
            return true;
        });

        return items;
    }

    useEffect(() => {
        setOffsetError(0);
    }, [productFilter]);

    useEffect(() => {
        let timeout;
        let ignore = false;
        const fetchData = async () => {
            setLoading(true);

            const ids = await fetchIds();
            
            timeout = setTimeout(async () => {
                const products = await fetchProducts(ids);

                if (ignore) return;
                setProductList(products);
                setLoading(false);
            }, 500)
        }
        fetchData();
        

        return () => {
            clearTimeout(timeout);
            ignore = true;
        };
    }, [page, productFilter]);

    const thereIsNextPage = keyRef.current in ids && page*LIMIT+LIMIT < ids[keyRef.current].length;

    return [productList, loading, thereIsNextPage];
}

export default useData;