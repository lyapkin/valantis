import React from 'react'
import Filter from './Filter';
import Pagination from './Pagination';
import { useRequestParams } from '../hooks/useRequestParams';
import useData from '../hooks/useData';

const List = () => {
    const [page, filter, dispatch] = useRequestParams();
    const [products, loading] = useData(page-1, filter);

    const productsHtml = products.map(item => (<li key={item.id}>
        <div className="product">
            <span className="product__id">id: {item.id}; </span>
            <span className="product__name">product: {item.product}; </span>
            <span className="product__price">price: {item.price}; </span>
            {item.brand && <span className="product__brand">brand: {item.brand};</span>}
        </div>
      </li>)
    )  ;
    

    return (
        <div className='products-box'>
            <div className='header'>
                <Filter filter={filter} dispatch={dispatch} />
            </div>
            <div className='products'>
                <Pagination page={page} dispatch={dispatch} />
                Товары:
                <ol>
                    {loading ?  "Loading..." : productsHtml}
                </ol>
            </div>
            <div className='footer'>
                <Pagination page={page} dispatch={dispatch} />
            </div>
        </div>
    )
}

export default List