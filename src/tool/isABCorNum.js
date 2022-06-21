export const isABCorNum = (str) => {
  //定义验证规则，由于字符串数字和字母的顺序可能不同。
  //也有可能字母和数字中间还包含了其他字符。故将验证规则分开定义。
  var regNumber = /\d+/; //验证0-9的任意数字最少出现1次。
  var regString = /[a-zA-Z]+/; //验证大小写26个字母任意字母最少出现1次。
  var AorN = /[0-9a-z]/i;
  var blank = /[\s]/i;
  //验证第一个字符串
  if (AorN.test(str)) {
    return 0;
  } else if (blank.test(str)) {
    return 1;
  } else {
    return 2;
  }
};

export function load(str) {
  var regex = /^[\u4E00-\u9FA5]+$/;
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
}
