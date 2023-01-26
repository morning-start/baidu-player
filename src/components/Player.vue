<template>
  <div class="player">
    <video id="video" :src="defInfo.videoSrc[defInfo.defIndex]" ref="myVideo" :width="videoInfo.width"
      :currentTime="videoInfo.currentTime" crossOrigin="anonymous" />

    <div class="container">
      <canvas ref="canvas" id="cvs" width="800" height="450"></canvas>

      <div class="control">
        <div class="button">
          <play-circle-outlined :style="setting.lSize" v-show="videoInfo.status" @click="pause()" />
          <pause-circle-outlined :style="setting.lSize" v-show="!videoInfo.status" @click="play()" />
        </div>
        <!-- <div class="range">
        </div> -->
        <input ref="range" type="range" min="0" :max="videoInfo.duration" v-model="videoInfo.currentTime">
        <div class="definition" :style="{ fontSize: '15px', color: '#fff' }">
          <a-dropdown placement="top">
            <a class="ant-dropdown-link" @click.prevent :style="{ fontSize: '16px', color: '#fff' }">
              {{ defInfo.definition[defInfo.defIndex] }}
            </a>
            <template #overlay>
              <a-menu :style="{ 'background-color': 'rgba(0, 0, 0, 0.5)' }">
                <a-menu-item v-for="item, index in defInfo.definition"
                  :style="{ fontSize: '15px', color: '#fff', 'background-color': 'rgba(0, 0, 0, 0.5)' }">
                  <a href="javascript:;" @click.prevent="switchDef(index)">{{ item }}</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <scissor-outlined :style="setting.rSize" @click="manualCapture()" />
        <bg-colors-outlined :style="setting.rSize" @click="colorReverse = !colorReverse" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { PlayCircleOutlined, PauseCircleOutlined, BgColorsOutlined, ScissorOutlined } from '@ant-design/icons-vue';
let setting = {
  lSize: { fontSize: '32px', margin: '0 5px', color: '#fff' },
  rSize: { fontSize: '20px', margin: '0 2px', color: '#fff' }
}

let videoInfo = reactive({
  width: 800, // 视频宽度
  status: false, // 播放状态 0 暂停 1 播放
  duration: 0, // 总时长
  currentTime: 0, // 当前播放时间
})

let defInfo = reactive({
  defIndex: 1,
  definition: ['流畅', '标清', '高清'],
  videoSrc: ['/public/Butterfly Anime Girl.mp4', '/public/《崩坏3》识之律者.mp4', '/public/《崩坏3》迷城骇兔.mp4']
})

let myVideo = ref(null)// video 对象
let range = ref(null) // range 对象
let colorReverse = false // 是否取反色
let mosaic = true // 是否马赛克


/**
 * @description: 视频暂停
 */
function pause() {
  myVideo.value.pause()
}

/**
 * @description: 视频播放
 */
function play() {
  myVideo.value.play()
}

/**
 * @description: 切换清晰度
 * @param {*} i 清晰度索引
 */
function switchDef(i) {
  if (i == defInfo.defIndex) return;// 防止重复点击
  defInfo.defIndex = i;
  // console.log(i);
  myVideo.value.pause()
}

/**
 * @description: 初始化canvas
 */
const initCanvas = () => {
  let cvs = document.getElementById('cvs');
  let video = document.getElementById('video');
  const ctx = cvs.getContext('2d');
  // cvs.height = video.offsetHeight
  // cvs.width = video.offsetWidth
  const playVideo = () => {
    // 画视频
    requestAnimationFrame(playVideo)
    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
    if (colorReverse) {
      reverseColor(ctx)
    }
    if (mosaic) {
      mosaicCanvas(ctx)
    }
  }
  playVideo()
}

/**
 * @description: 获取视频像素并取反色
 * @param {*} ctx canvas对象
 * @return {*} null
 */
const reverseColor = (ctx) => {
  // 获取视频像素
  const imgData = ctx.getImageData(0, 0, video.offsetWidth, video.offsetHeight);
  // 取反色
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
  }
  // 画像素
  ctx.putImageData(imgData, 0, 0);
}

// 画布部分马赛克
const mosaicCanvas = (ctx, x = 0, y = 0, width = 100, height = 100) => {
  let imgData = ctx.getImageData(0, 0, width, height)
  let data = imgData.data
  let w = imgData.width
  let h = imgData.height
  let r = 10

  // console.log(r);
  ctx.putImageData(imgData, 0, 0);

}

/**
 * @description: 转换图片为文件
 * @param {*} dataUrl base64
 * @param {*} filename 文件名
 * @param {*} type 文件类型
 * @return {*} File
 */
function DataURLToFile(dataUrl, filename = "file", type) {
  let arr = dataUrl.split(",");
  let bstr = atob(arr[1]);
  !type && (type = arr[0].replace("data:", "").replace(";base64", ""));

  let n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type });
}

/**
 * @description: 截取视频当前帧并下载
 * @param {*} filename 文件名
 */
function manualCapture(filename = "picture") {
  // let canvas = document.getElementById('cvs');
  let file = DataURLToFile(cvs.toDataURL())
  let aLink = document.createElement("a");
  aLink.download = filename;
  aLink.href = URL.createObjectURL(file);
  aLink.click();
  URL.revokeObjectURL(file);
}

onMounted(() => {
  initCanvas()
  myVideo.value.addEventListener('loadedmetadata', () => {
    /* 视频基本信息加载完成 */
    videoInfo.duration = myVideo.value.duration
  })

  // 监听播放事件, 恢复当前播放时间
  myVideo.value.addEventListener('play', () => {
    myVideo.value.currentTime = videoInfo.currentTime
    videoInfo.status = true
  })
  // 监听暂停事件, 记录当前播放时间
  myVideo.value.addEventListener('pause', () => {
    videoInfo.currentTime = myVideo.value.currentTime
    videoInfo.status = false
  })
  // 监听播放进度
  myVideo.value.addEventListener('timeupdate', () => {
    range.value.value = myVideo.value.currentTime
  })
})
</script>

<style scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
}

.control {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
}

input {
  flex-grow: 1;
  /* width: 100%; */
}

input[type=range]:focus {
  outline: none;
}
</style>
