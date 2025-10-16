export const supportedLngs = ['en', 'ko'];

export const getStaticParams = () => {
  return supportedLngs.map((locale) => ({ locale }));
};