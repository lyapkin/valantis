import React from 'react'
import { FILTER } from '../reducers/requestParamsReducer';

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
            <label className="filter__field-label" htmlFor="filter-product">Название:</label>
            <input className="filter__field" id="filter-product" name="product" />

            <label className="filter__field-label" htmlFor="filter-price">Цена:</label>
            <input className="filter__field" id="filter-price" name="price" type="number" />

            <label className="filter__field-label" htmlFor="filter-brand">Бренд:</label>
            <input className="filter__field" id="filter-brand" name="brand" />

            <button>Применить</button>
        </form>
    )
}

export default Filter