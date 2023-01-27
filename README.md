# 播放器组件

vite + vue3 +[antd](https://www.antdv.com/docs/vue/introduce-cn)

使用 canvas 替代 video 功能，后续会用封装好的解码器来完成替代。

目前只进行函数封装了，后续会进行组件封装

## 功能

- [x] 切换清晰度
- [x] canvas 替换 video
- [x] 截屏
- [x] 视频反色
- [x] 局部马赛克
- [ ] 解码器替代 video

## 播放器组件---Player

组件结构

- container：视频控制条
- video：视频
- canvas：视频画布
