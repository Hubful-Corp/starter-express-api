import * as CryptoJS from "crypto-js";
import environment from "../configs";
export const encryptString = (message: string): string => {
  const encryptedMessage = CryptoJS.AES.encrypt(message, environment.secretKey)
    .toString()
    .replaceAll("/", "$1")
    .replaceAll("+", "$2")
    .replaceAll("=", "$3");
  return encryptedMessage;
};

export const decryptString = (encryptedMessage: string): string => {
  const decryptedBytes = CryptoJS.AES.decrypt(
    encryptedMessage
      .replaceAll("$1", "/")
      .replaceAll("$2", "+")
      .replaceAll("$3", "="),
    environment.secretKey
  );
  const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
