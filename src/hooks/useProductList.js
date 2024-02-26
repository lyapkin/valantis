import { useReducer, useState } from "react";


const useProductList = (init) => {
    const [productList, dispatch] = useState(init);

    const set = productList.length > 0 ? new Set() : null;
    const outputList = productList
        .map(item => {
            if (!set.has(item.id)) {
                set.add(item.id);
                return (
                    <li key={item.id}>
                        <span>{item.id}</span>
                        <span>{item.product}</span>
                        <span>{item.price}</span>
                        <span>{item.brand}</span>
                    </li>)
            }
            return null
        })

    return [outputList, dispatch];
}

export default useProductList;