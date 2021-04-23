export const REMOVE_CART_DATA = 'REMOVE_CART_DATA';
export const SET_SHIPPING_ADDRESS = 'SET_SHIPPING_ADDRESS';
export const SET_CHANNEL = 'SET_CHANNEL';
export const removeCartData = () => ({
  type: REMOVE_CART_DATA,
});
export const setShippingAddress = (address: any) => ({
  type: SET_SHIPPING_ADDRESS,
  payload: address,
});
export const setChannel = (channel: any) => ({
  type: SET_CHANNEL,
  payload: channel,
});
