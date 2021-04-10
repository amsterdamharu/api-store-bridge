import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  activeCartCreateSelectResult,
  orderFromCartThunk,
  activeCartThunk,
} from '../commercetools';
function Checkout() {
  const dispatch = useDispatch();
  const selectActiveCart = useMemo(
    () => activeCartCreateSelectResult({}),
    []
  );
  useEffect(() => {
    dispatch(activeCartThunk({}));
  }, [dispatch]);
  const { resolved: cart } = useSelector(selectActiveCart);
  const checkout = useCallback(() => {
    const query = {
      cartId: cart?.id, cartVersion: cart?.version
    };
    dispatch(orderFromCartThunk(query));
  }, [cart?.id, cart?.version, dispatch]);
  console.log('cart is now:', cart);
  return (
    <div>
      <button onClick={checkout} disabled={!cart}>
        Checkout
      </button>
    </div>
  );
}

export default Checkout;
