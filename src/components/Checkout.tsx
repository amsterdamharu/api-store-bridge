import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartData } from '../actions';
import {
  activeCartCreateSelectResult,
  orderFromCartThunk,
  activeCartThunk,
  cartActionThunk,
  cartActions,
} from '../commercetools';
import { selectShippingAddress } from '../commercetools/selectors';
function Checkout() {
  //@todo: get a list of channels to select for shippingAddress

  //@todo: stick this in a custom hook
  const dispatch = useDispatch();
  const selectActiveCart = useMemo(
    () => activeCartCreateSelectResult({}),
    []
  );
  useEffect(() => {
    dispatch(activeCartThunk({}));
  }, [dispatch]);
  const { resolved: cart } = useSelector(selectActiveCart);
  const shippingAddress = useSelector(
    selectShippingAddress
  );
  const checkout = useCallback(() => {
    ((dispatch(
      cartActionThunk({ shippingAddress })
    ) as unknown) as Promise<any>).then(({ query, data: cart }: any) => {
      dispatch(cartActions.actions.creators.remove(query));
      return dispatch(orderFromCartThunk({
        cartId: cart?.id, cartVersion: cart?.version
      }));
    }).then(
      () => dispatch(removeCartData())
    )
  }, [shippingAddress, dispatch]);
  return (
    <div>
      <button onClick={checkout} disabled={!cart}>
        Checkout
      </button>
    </div>
  );
}

export default Checkout;
