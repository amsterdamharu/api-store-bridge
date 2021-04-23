import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../commercetools';
import { MdShoppingCart } from 'react-icons/md';

function Header() {
  const location = useLocation();
  const { cartResult } = useCart();
  const { resolved: cart } = cartResult;
  return (
    <div className="header">
      <div className="header-link"></div>
      <Link className="header-link" to="/">
        SHOP
      </Link>
      <Link
        className="cart-btn-container header-link"
        to="/checkout"
      >
        <MdShoppingCart size="30px" />
        <div className="cart-badge">
          {cart?.lineItems?.length}
        </div>
      </Link>
    </div>
  );
}

export default Header;
