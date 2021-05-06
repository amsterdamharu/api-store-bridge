import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCountry,
  useChannels,
} from '../../commercetools';
import {
  setShippingAddress,
  setChannel,
} from '../../actions';
import { selectChannel } from '../../commercetools/selectors';

export default function PickUpLocation() {
  const selectedChannel = useSelector(selectChannel);
  const [channelState, setChannelState] = useState(
    selectedChannel
  );
  const country = useSelector(selectCountry);
  const query = useMemo(() => ({ country }), [country]);
  const channels = useChannels(query)?.resolved?.items;
  const dispatch = useDispatch();

  const selectedChannelObj = () => {
    const result = channels?.filter((obj: any) => {
      return obj.id === channelState;
    });
    return result ? result[0] : null;
  };

  const setSelectedChannel = () => {
    dispatch(setChannel(channelState));
  };
  const setShipping = () => {
    dispatch(
      setShippingAddress(selectedChannelObj()?.address)
    );
  };

  useEffect(setSelectedChannel, [channelState]);
  useEffect(setShipping, [channelState]);

  return (
    <div>
      {channels && (
        <div className="locations-section">
          <label htmlFor="location">
            Select a pick-up location
          </label>

          <select
            name="location"
            id="location"
            value={channelState}
            onChange={(e) => {
              setChannelState(e.target.value);
            }}
          >
            {channels.map((channel: any) => (
              <option value={channel.id} key={channel.id}>
                {channel.name.en}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
