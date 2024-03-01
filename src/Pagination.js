import React from 'react'
import { PAGE_NEXT, PAGE_PREV } from './reducers/requestParamsReducer';

const Pagination = ({page, dispatch}) => {
    const handleClick = (e) => {
        if (e.target.tagName !== "BUTTON") return;

        const action = e.target.dataset.action;

        
        switch (action) {
            case "prev":
                dispatch({type: PAGE_PREV});
                break;
            case "next":
                dispatch({type: PAGE_NEXT});
        }
    }
    return (
        <div onClick={handleClick} className='pagination'>
            <span>Страница: {page}</span>

            <button data-action="prev" disabled={page <= 1}>Пред.</button> 
            <button data-action="next">След.</button>
        </div>
    )
}

export default Pagination