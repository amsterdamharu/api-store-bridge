import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useCart from '../commercetools/hooks/useCart';
import useChannels from '../commercetools/hooks/useChannels';
import { selectCountry } from '../commercetools/selectors';
import Channel from './Chanel';

function Checkout() {
  const { cartResult, checkout } = useCart();
  const { resolved: cart } = cartResult;
  const country = useSelector(selectCountry);
  const query = useMemo(() => ({ country }), [country])
  const channels = useChannels(query)?.resolved?.items
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
