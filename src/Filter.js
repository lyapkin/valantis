import React from 'react'
import { FILTER } from './reducers/requestParamsReducer';

const Filter = ({filter, dispatch}) => {

    const handleClick = (e) => {
        e.preventDefault()
        if (e.target.tagName !== "BUTTON") return;

        const form = e.currentTarget
        const product = form.elements.product.value;
        const price = Number(form.elements.price.value);
        const brand = form.elements.brand.value;
        
        dispatch({type: FILTER, payload: {product, price, brand}})
    }

    return (
        <form onClick={handleClick} className='filter'>
            <div>Фильтр</div>
            <label htmlFor="filter-product">Название:</label>
            <input id="filter-product" name="product" />

            <label htmlFor="filter-price">Цена:</label>
            <input id="filter-price" name="price" type="number" />

            <label htmlFor="filter-brand">Бренд:</label>
            <input id="filter-brand" name="brand" />

            <button>Применить</button>
        </form>
    )
}

export default Filter