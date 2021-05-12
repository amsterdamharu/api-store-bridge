function CartItems({ cart }: any) {
  return (
    <div className="cart-wrap">
      <table className="cart-items-table">
        <thead>
          <tr>
            <th>PRODUCTS</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {cart?.lineItems?.map((item: any) => (
            <tr key={item.id} className="cart-item-wrap">
              <td className="cart-items-product">
                <img
                  className="cart-item-img"
                  src={item.variant.images[0].url}
                  alt="Product"
                />
                <div className="cart-item-name">
                  {item.name.en}
                </div>
              </td>
              {/* <td>
                <div className="quantity-input">
                  <button
                    className="minus"
                    onClick={() => item.quantity - 1}
                  >
                    &mdash;
                  </button>
                  <input
                    className="number"
                    type="text"
                    value={item.quantity}
                  />
                  <button
                    className="plus"
                    onClick={() => item.quantity + 1}
                  >
                    &#xff0b;
                  </button>
                </div>
              </td> */}
              <td>{item.quantity}</td>
              <td>
                <div className="cart-item-price">
                  $
                  {item?.price?.discounted?.value
                    ? item?.price?.discounted?.value
                        .centAmount / 100
                    : item.price.value.centAmount / 100}
                </div>
              </td>
              <td>
                $
                {item.price.discounted?.value
                  ? (item.price?.discounted?.value
                      .centAmount /
                      100) *
                    item.quantity
                  : (item.price.value.centAmount / 100) *
                    item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartItems;
