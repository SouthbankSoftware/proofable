// @ts-ignore
import { keccak256 } from "eth-lib/lib/hash";

/**
 * The size of a hash
 */
export const hashSize = 32;

/**
 * Hashes the given data using SHA3 256 Keccak
 */
export function sha3(data: Buffer | string): string {
  if (typeof data === "string" && !data.startsWith("0x")) {
    throw new Error("hex string must start with `0x`");
  }

  return (keccak256(data) as string).substring(2);
}
