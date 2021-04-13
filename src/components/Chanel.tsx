import React, {
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { setShippingAddress } from '../actions';
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
