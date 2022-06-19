import dayjs from "dayjs";
// 计时器
const timepiece = (nowTime) => {
  const diffTime = dayjs.duration(dayjs() - nowTime);
  // const day = diffTime.days(); //天
  // const hours = diffTime.hours(); //小时
  const minutes = diffTime.minutes(); //分钟
  const seconds = diffTime.seconds(); //秒
  const time = `${minutes}分${seconds}秒`;
  const totalSec = diffTime.$ms / 1000;
  return { time, totalSec };
};
