import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Platform } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const widthPercentageToDP = wp;
export const heightPercentageToDP = hp;

/**
 * 将设计稿中的像素值转换为响应式尺寸
 * @param px 设计稿中的像素值（基于375px宽度）
 * @returns number 响应式尺寸
 */
export const px2wp = (px: number): number => {
  return wp(`${(px / 375) * 100}%`);
};

/**
 * 将设计稿中的像素值转换为响应式尺寸
 * @param px 设计稿中的像素值（基于812px高度）
 * @returns number 响应式尺寸
 */
export const px2hp = (px: number): number => {
  return hp(`${(px / 812) * 100}%`);
};

// 加密密钥，建议使用环境变量存储
const CRYPTO_KEY = "KEu5INycJHjwSrNvgXijIQ=="; // 使用32字符的密钥
const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16字节的IV

/**
 * AES加密
 * @param text 要加密的文本
 * @returns string 加密后的文本
 */
export const encrypt = (text: string): string => {
  try {
    // 创建密钥
    const key = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);

    // 加密
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 返回base64编码的加密字符串
    return encrypted.toString();
  } catch (error) {
    console.error("加密失败:", error);
    return "";
  }
};

/**
 * AES解密
 * @param encryptedText 加密后的文本
 * @returns string 解密后的文本
 */
export const decrypt = (encryptedText: string): string => {
  try {
    // 创建密钥
    const key = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);

    // 解密
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 返回解密后的字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("解密失败:", error);
    return "";
  }
};

/**
 * 生成随机密钥
 * @param length 密钥长度
 * @returns string 随机密钥
 */
export const generateRandomKey = (length: number = 32): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = chars.length;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

/**
 * 生成随机IV
 * @returns string 16字节的随机IV
 */
export const generateRandomIV = (): string => {
  return generateRandomKey(16);
};

// 设置认证 token
export async function setLocalCache(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      await setItemAsync(key, value);
    }
  } catch (error) {
    console.error("Failed to save auth token:", error);
  }
}

// 获取认证 token
export async function getLocalCache(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key);
    } else {
      return await getItemAsync(key);
    }
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
}

// 清除认证 token
export async function clearLocalCache(key: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
    } else {
      await deleteItemAsync(key);
    }
  } catch (error) {
    console.error("Failed to clear auth token:", error);
  }
}


/**
 * 图片代理地址
 * @param url
 * @returns
 */
export const imgProxy = (url?: string) => {
  if (!url) return "";
  if (/http/.test(url)) return url;
  return process.env.EXPO_PUBLIC_IMG_HOST + url;
};
