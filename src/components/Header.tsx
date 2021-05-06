import { Link } from 'react-router-dom';
import { useCart } from '../commercetools';
import { MdShoppingCart } from 'react-icons/md';

function Header() {
  const { cartResult } = useCart();
  const { resolved: cart } = cartResult;
  return (
    <div className="header">
      <Link className="header-link" to="/">
        HOME
      </Link>
      <Link
        className="cart-btn-container header-link"
        to="/cart"
      >
        <MdShoppingCart size="30px" />
        <div className="cart-badge">
          {cart?.lineItems?.length || 0}
        </div>
      </Link>
    </div>
  );
}

export default Header;
