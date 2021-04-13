import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartData } from '../../actions';
import {
  activeCartCreateSelectResult,
  orderFromCartThunk,
  activeCartThunk,
  cartActionThunk,
  cartActions,
} from '../../commercetools';
import { selectShippingAddress } from '../../commercetools/selectors';
export default function useCart() {
  const dispatch = useDispatch();
  const selectActiveCart = useMemo(
    () => activeCartCreateSelectResult({}),
    []
  );
  useEffect(() => {
    dispatch(activeCartThunk({}));
  }, [dispatch]);
  const cartResult = useSelector(selectActiveCart);
  const shippingAddress = useSelector(
    selectShippingAddress
  );
  const checkout = useCallback(() => {
    ((dispatch(
      cartActionThunk({ shippingAddress })
    ) as unknown) as Promise<any>)
      .then(({ query, data: cart }: any) => {
        dispatch(
          cartActions.actions.creators.remove(query)
        );
        return dispatch(
          orderFromCartThunk({
            cartId: cart?.id,
            cartVersion: cart?.version,
          })
        );
      })
      .then(
        //@todo: why this resolves when it fails?
        () => dispatch(removeCartData())
      );
  }, [shippingAddress, dispatch]);
  return {
    checkout,
    cartResult,
  };
}
