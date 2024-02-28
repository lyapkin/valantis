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
        <form onClick={handleClick}>
            <input name="product" />
            <input name="price" type="number" />
            <input name="brand" />
            <button>Применить</button>
        </form>
    )
}

export default Filter