import React from 'react';
import useCart from '../commercetools/hooks/useCart';
import useChannels from '../commercetools/hooks/useChannels';
import Channel from './Chanel';
const QUERY = { country: "US" }
function Checkout() {
  const { cartResult, checkout } = useCart();
  const { resolved: cart } = cartResult;
  const channels = useChannels(QUERY)?.resolved?.items
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
