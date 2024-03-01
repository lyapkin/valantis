import { useState } from "react";
import { toRequest } from "../services/requests";


const useProductList = () => {
    const [productList, setProductList] = useState([]);    

    const outputList = productList
        .map(item => (<li key={item.id}>
                        <span>id: {item.id}; </span>
                        <span>product: {item.product}; </span>
                        <span>price: {item.price}; </span>
                        {item.brand && <span>brand: {item.brand};</span>}
                      </li>)
        );

        // const fetchItems = async (ids) => {
        //     const body = JSON.stringify(
        //         {
        //             action: "get_items",
        //             params: { ids }
        //         }
        //     );

        //     const set = new Set();
        //     const items = (await toRequest(body)).filter(item => {
        //         if (set.has(item.id)) return false;
        //         set.add(item.id);
        //         return true;
        //     });

        //     setProductList(items);
        // }

    return [outputList, setProductList];
}

export default useProductList;