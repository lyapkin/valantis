import React, { useEffect, useState } from 'react'
import Filter from './Filter';
import Pagination from './Pagination';
import useProductList from './hooks/useProductList';
import { useRequestData } from './hooks/useRequestParams';

const List = () => {
    const [page, filter, dispatch, fetchData] = useRequestData();
    const [productList, setProductList] = useProductList();
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        fetchData()
            .then(result => {
                if (ignore) return;

                setProductList(result);
                setLoading(false);
            });

        return () => ignore = true;
    }, [page, filter]);
    

    return (
        <div>
            <Filter filter={filter} dispatch={dispatch} />
            <ol>
                {loading ?  "Loading..." : productList}
            </ol>
            <Pagination page={page} dispatch={dispatch} />
        </div>
    )
}

export default List