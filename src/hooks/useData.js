import { useEffect, useState } from "react";
import { LIMIT } from "../utils/const";
import { fetchFilteredIds, fetchUnfilteredIds, toRequest } from "../services/requests";

const useData = (page, productFilter) => {
    const [ids, setIds] = useState({});
    const [productList, setProductList] = useState([]);
    const [offsetError, setOffsetError] = useState(0);

    const [loading, setLoading] = useState(false);

    const fetchIds = async () => {
        let key = productFilter.brand + productFilter.price + productFilter.product + "";
        if ((key in ids) && (ids[key].length > page * LIMIT)) {
            return ids[key].slice(page*LIMIT, page*LIMIT + LIMIT);
        }
        
        const filter = new Map();
        
        if (productFilter.brand.trim().length > 0) {
            filter.set("brand", productFilter.brand.trim())
        }
        if (productFilter.price > 0) {
            filter.set("price", productFilter.price)
        }
        if (productFilter.product.trim().length > 0) {
            filter.set("product", productFilter.product.trim())
        }
        
        let receivedIds;
        if (filter.size > 0) {
            receivedIds = await fetchFilteredIds(filter);
        } else {
            const idsSet = new Set();
            let offsetAccumulator = {error: offsetError};
            receivedIds = Array.from(await fetchUnfilteredIds(page * LIMIT + offsetError,
                                            LIMIT, LIMIT, idsSet, offsetAccumulator));
            if (offsetAccumulator.error > offsetError) {
                setOffsetError(offsetAccumulator.error);
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
        setOffsetError(0)
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

    return [productList, loading];
}

export default useData;