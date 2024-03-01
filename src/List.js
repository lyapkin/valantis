import React, { useEffect, useState } from 'react'
import Filter from './Filter';
import Pagination from './Pagination';
import useProductList from './hooks/useProductList';
import { useRequestData } from './hooks/useRequestParams';
import { toRequest } from './services/requests';

const List = () => {
    const [page, filter, dispatch, fetchIds] = useRequestData();
    const [productList, setProductList] = useProductList();
    
    const [loading, setLoading] = useState(false);

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
        let timeout;
        const fetchData = async () => {
            setLoading(true);

            const ids = await fetchIds();

            timeout = setTimeout(async () => {
                const products = await fetchProducts(ids);
                setProductList(products);
                setLoading(false);
            }, 500)
        }
        fetchData();
        

        return () => clearTimeout(timeout);
    }, [page, filter]);
    

    return (
        <div className='products-box'>
            <Filter filter={filter} dispatch={dispatch} />
            <div className='products'>
                Товары:
                <ol>
                    {loading ?  "Loading..." : productList}
                </ol>
            </div>
            <Pagination page={page} dispatch={dispatch} />
        </div>
    )
}

export default List