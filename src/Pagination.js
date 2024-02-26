import React from 'react'

const Pagination = ({page, setOffset}) => {
    const handleClick = (e) => {
        if (e.target.tagName !== "BUTTON") return;

        const action = e.target.dataset.action;

        
        setOffset(curPage => {
            switch (action) {
                case "prev":
                    return curPage - 1;
                case "next":
                    return curPage + 1;
            }
        })
    }
    return (
        <div onClick={handleClick}>
            {
            page > 1 ? 
                <button data-action="prev">Пред.</button> :
                null
            }
            <span>{page}</span>
            <button data-action="next">След.</button>
        </div>
    )
}

export default Pagination