import { createSelector } from 'reselect';

export const selectPreferences = (state: any) =>
  state.preferences;
export const selectShippingAddress = createSelector(
  [selectPreferences],
  (preferences) => preferences.shippingAddress
);
export const selectChannel = createSelector(
  [selectPreferences],
  (preferences) => preferences.channel
);
export const selectCountry = createSelector(
  [selectPreferences],
  (preferences) => preferences.country
);
