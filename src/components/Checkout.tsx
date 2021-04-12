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
  channelsThunk,
} from '../commercetools';
import { selectShippingAddress } from '../commercetools/selectors';
function Checkout() {
  const dispatch = useDispatch();
  //@todo: render list of channels with button to set address
  //  for shipping address (own component)
  useEffect(
    () => { dispatch(channelsThunk({})) }, [dispatch]
  )
  //@todo: stick this in a custom hook
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
