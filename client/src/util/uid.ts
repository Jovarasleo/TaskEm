export const uid = () => {
  const data = new Uint8Array(16);
  window.crypto.getRandomValues(data);

  // Set the version and variant bits
  data[6] = (data[6] & 0x0f) | 0x40; // Version 4 (random)
  data[8] = (data[8] & 0x3f) | 0x80; // Variant 10 (reserved for UUIDs)

  // Convert the array of bytes to a hexadecimal string without using subtr
  const byteArrayToHex = (byte: number) => {
    const hex = byte.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const guid = Array.from(data).map(byteArrayToHex).join("");

  // Format the GUID
  return `${guid.slice(0, 8)}-${guid.slice(8, 12)}-${guid.slice(12, 16)}-${guid.slice(
    16,
    20
  )}-${guid.slice(20)}`;
};
