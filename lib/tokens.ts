import { customAlphabet } from "nanoid";

const slugAlphabet = "23456789abcdefghjkmnpqrstuvwxyz"; // no ambiguous chars
const tokenAlphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateSlug = customAlphabet(slugAlphabet, 10);
export const generateToken = customAlphabet(tokenAlphabet, 32);
