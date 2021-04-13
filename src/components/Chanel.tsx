import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartData, setShippingAddress } from '../actions';
import {
  activeCartCreateSelectResult,
  orderFromCartThunk,
  activeCartThunk,
  cartActionThunk,
  cartActions,
  channelsThunk,
} from '../commercetools';
function Channel({ channel }: any) {
  const dispatch = useDispatch();
  const setShipping = useCallback(() => {
    dispatch(setShippingAddress(channel.address))
  }, [channel.address, dispatch]);
  return (
    <div>
      <div>{channel.name.en}</div>
      <button onClick={setShipping}>Pick up</button>
    </div>
  );
}

export default Channel;
