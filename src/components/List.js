import React from 'react'
import Filter from './Filter';
import Pagination from './Pagination';
import useProductHtml from '../hooks/useProductHtml';
import { useRequestParams } from '../hooks/useRequestParams';
import useData from '../hooks/useData';

const List = () => {
    const [page, filter, dispatch] = useRequestParams();
    const [products, loading] = useData(page-1, filter);
    const productHtml = useProductHtml(products);
    

    return (
        <div className='products-box'>
            <div className='header'>
                <Filter filter={filter} dispatch={dispatch} />
            </div>
            <div className='products'>
                <Pagination page={page} dispatch={dispatch} />
                Товары:
                <ol>
                    {loading ?  "Loading..." : productHtml}
                </ol>
            </div>
            <div className='footer'>
                <Pagination page={page} dispatch={dispatch} />
            </div>
        </div>
    )
}

export default List