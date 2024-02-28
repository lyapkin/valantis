import { useState } from "react";


const useProductList = () => {
    const [productList, dispatch] = useState([]);    

    const outputList = productList
        // .slice(page*LIMIT, page*LIMIT+LIMIT)
        .map(item => (<li key={item.id}>
                        <span>id: {item.id}; </span>
                        <span>product: {item.product}; </span>
                        <span>price: {item.price}; </span>
                        {item.brand && <span>brand: {item.brand};</span>}
                      </li>)
        );

    return [outputList, dispatch];
}

export default useProductList;