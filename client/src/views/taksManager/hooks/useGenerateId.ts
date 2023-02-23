export const useGenerateId = () => {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array) + Date.now().toString(36);
};
