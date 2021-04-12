import { createSelector } from 'reselect';

export const selectPreferences = (state: any) =>
  state.preferences;
export const selectShippingAddress = createSelector(
  [selectPreferences],
  (preferences) => preferences.shippingAddress
);
