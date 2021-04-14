const makeUrl = (path: string) =>
  new URL(
    `${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_PROJECT_KEY}/${path}`
  );
export default makeUrl;
