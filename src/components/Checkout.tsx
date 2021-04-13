import React, {
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  channelsThunk,
  channelsCreateSelectResult,
} from '../commercetools';
import useCart from '../commercetools/hooks/useCart';
import Channel from './Chanel';
function Checkout() {
  const { cartResult, checkout } = useCart();
  const dispatch = useDispatch();
  useEffect(
    () => { dispatch(channelsThunk({})) }, [dispatch]
  );
  const selectChannels = useMemo(
    () => channelsCreateSelectResult({}), []
  )
  const { resolved: ch } = useSelector(selectChannels);
  const channels = ch?.items;
  const { resolved: cart } = cartResult;
  return (
    <div>
      <button onClick={checkout} disabled={!cart || !cart?.lineItems?.length}>
        Checkout
      </button>
      {
        cart && channels && channels.map(
          (channel: any) => <Channel key={channel.id} channel={channel} />
        )

      }
    </div>
  );
}

export default Checkout;
