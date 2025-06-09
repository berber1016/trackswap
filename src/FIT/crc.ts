// prettier-ignore
const crc_table = [
    0x0000, 0xcc01, 0xd801, 0x1400, 0xf001, 0x3c00, 0x2800, 0xe401,
    0xa001, 0x6c00, 0x7800, 0xb401, 0x5000, 0x9c01, 0x8801, 0x4400
  ];

const update_nibble = (crc: number, nibble: number): number =>
  ((crc >>> 4) ^ crc_table[(crc & 0xf) ^ nibble]) & 0xffff;
const update_nibbles = (crc: number, lo: number, hi: number): number =>
  update_nibble(update_nibble(crc, lo), hi);
const update = (crc: number, byte: number): number =>
  update_nibbles(crc, byte & 0xf, byte >>> 4);

export function crc(
  buffer: ArrayBuffer | Uint8Array,
  initial: number = 0
): number {
  let crcValue = initial;
  const uint8Array =
    buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;

  for (let i = 0; i < uint8Array.length; i++) {
    crcValue = update(crcValue, uint8Array[i]);
  }

  return crcValue;
}
