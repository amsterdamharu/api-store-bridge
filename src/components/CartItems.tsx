function CartItems({ cart }: any) {
  return (
    <div className="cart-wrap">
      <table className="cart-items-table">
        <thead>
          <tr>
            <th>Items</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
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
              <td>{item.quantity}</td>
              <td>
                <div className="cart-item-price">
                  ${item.price.value.centAmount / 100}
                </div>
              </td>
              <td>
                $
                {(item.price.value.centAmount / 100) *
                  item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-price">
        ${cart.totalPrice.centAmount / 100}
      </div>
    </div>
  );
}

export default CartItems;
