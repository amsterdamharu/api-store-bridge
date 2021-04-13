import { createSelector } from 'reselect';

export const selectPreferences = (state: any) =>
  state.preferences;
export const selectShippingAddress = createSelector(
  [selectPreferences],
  (preferences) => preferences.shippingAddress
);
export const selectCountry = createSelector(
  [selectPreferences],
  (preferences) => preferences.country
);
