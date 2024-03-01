
const useProductsHtml = (productList) => { 

    const outputList = productList
        .map(item => (<li key={item.id}>
                        <div className="product">
                            <span className="product__id">id: {item.id}; </span>
                            <span className="product__name">product: {item.product}; </span>
                            <span className="product__price">price: {item.price}; </span>
                            {item.brand && <span className="product__brand">brand: {item.brand};</span>}
                        </div>
                      </li>)
        );

    return outputList;
}

export default useProductsHtml;