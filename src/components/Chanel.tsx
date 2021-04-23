import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShippingAddress, setChannel } from '../actions';
import { selectChannel } from '../commercetools/selectors';

function Channel({ channel }: any) {
  const dispatch = useDispatch();
  const setShipping = useCallback(() => {
    dispatch(setShippingAddress(channel.address));
  }, [channel.address, dispatch]);
  const setSelectedChannel = useCallback(() => {
    dispatch(setChannel(channel));
  }, [channel, dispatch]);
  const selectedChannelId = useSelector(selectChannel).id;

  return (
    <div
      className={
        selectedChannelId === channel.id
          ? 'channel-wrap selected-channel'
          : 'channel-wrap'
      }
      onClick={() => {
        setShipping();
        setSelectedChannel();
      }}
    >
      <div className="channel-name">{channel.name.en}</div>
    </div>
  );
}

export default Channel;
