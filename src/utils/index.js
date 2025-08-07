/**
 * 获取有效的数字值
 * @param {*} val - 输入值
 * @param {number} defaultValue - 默认值
 * @returns {number}
 */
export function getValidNumber(val, defaultValue = 0) {
  const num = Number(val);
  return Number.isFinite(num) ? num : defaultValue;
}

/**
 * 验证对象
 * @param {*} obj - 待验证对象
 * @param {string} name - 对象名称
 */
export function validatePlainObject(obj, name) {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    return true
  } else {
    throw new TypeError(`${name} must be a plain object`);
  }
}

// 定义图片类型枚举
export const ImageTypeMap = {
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp'
}


export class Result {
 static #success_code = 0;
 static #error_code = 2001;

  static success(data, message = 'success') {
    return {
      code: this.#success_code,
      data,
      message
    };
  }

  static error(message = 'error') {
    return {
      code: this.#error_code,
      message
    }
  }
}
