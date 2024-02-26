import React, { useEffect, useState } from 'react'
import { fetchData } from './services/requests';
import Filter from './Filter';
import Pagination from './Pagination';
import useProductList from './hooks/useProductList';

const List = () => {
    const [productList, setProductList] = useProductList([]);
    const [filter, setFilter] = useState({
        product: "",
        price: null,
        brand: ""
    })
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        fetchData(offset, filter)
            .then(result => setProductList(result));
    }, [offset, filter])
    

    return (
        <div>
            <Filter filter={filter} setFilter={setFilter} />
            <ol>
                {productList}
            </ol>
            <Pagination page={offset+1} setOffset={setOffset} />
        </div>
    )
}

export default List