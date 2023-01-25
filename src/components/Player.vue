<template>
  <video :src="defInfo.videoSrc[defInfo.defIndex]" ref="video" :width="videoInfo.width"
    :currentTime="videoInfo.currentTime" />
  <!-- <canvas ref="canvas"></canvas> -->

  <div class="container">
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
    <scissor-outlined :style="setting.rSize" />
    <bg-colors-outlined :style="setting.rSize" />
  </div>
  <canvas ref="canvas" :width="ctxInfo.width" :height="ctxInfo.height" :style="ctxInfo.style"></canvas>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { PlayCircleOutlined, PauseCircleOutlined, BgColorsOutlined, ScissorOutlined } from '@ant-design/icons-vue';
let setting = {
  lSize: { fontSize: '32px', margin: '0 5px', color: '#fff' },
  rSize: { fontSize: '20px', margin: '0 2px', color: '#fff' }
}

let videoInfo = reactive({
  width: 500, // 视频宽度
  status: false, // 播放状态 0 暂停 1 播放
  duration: 0, // 总时长
  currentTime: 0, // 当前播放时间
})

let ctxInfo = {
  width: videoInfo.width,
  height: videoInfo.width * 9 / 16,
  style: 'border:1px solid pink'
}

// let canvas = ref(null) // canvas 对象
let video = ref(null)// video 对象
let range = ref(null) // range 对象


// SECTION 播放暂停
function pause() {
  video.value.pause()
}
function play() {
  video.value.play()
}
// !SECTION

let canvas = ref(null) // canvas 对象
function draw() {

  let ctx = canvas.value.getContext('2d');
  // 画视频
  ctx.fillStyle = "#000";
  ctx.fillRect(10, 10, 100, 80);
}


onMounted(() => {
  draw()

  video.value.addEventListener('loadedmetadata', () => {
    /* 视频基本信息加载完成 */
    videoInfo.duration = video.value.duration
    // 视频长宽
    // console.log(video.value.videoWidth, video.value.videoHeight);
    // console.log(video.value.duration);
  })

  // 监听播放事件, 恢复当前播放时间
  video.value.addEventListener('play', () => {
    video.value.currentTime = videoInfo.currentTime
    videoInfo.status = true
  })
  // 监听暂停事件, 记录当前播放时间
  video.value.addEventListener('pause', () => {
    videoInfo.currentTime = video.value.currentTime
    videoInfo.status = false
  })
  // 监听播放进度
  video.value.addEventListener('timeupdate', () => {
    range.value.value = video.value.currentTime
  })
})

// SECTION 切换清晰度
let defInfo = reactive({
  defIndex: 1,
  definition: ['流畅', '标清', '高清'],
  videoSrc: ['/public/Butterfly Anime Girl.mp4', '/public/《崩坏3》识之律者.mp4', '/public/《崩坏3》迷城骇兔.mp4']
})

function switchDef(i) {
  if (i == defInfo.defIndex) return;// 防止重复点击
  defInfo.defIndex = i;
  // console.log(i);
  video.value.pause()
}

// TODO 对于没有src的video设置menu为disabled

// !SECTION
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
}

.range {
  flex-grow: 1;
}

input {
  flex-grow: 1;
  /* width: 100%; */
}

input[type=range]:focus {
  outline: none;
}
</style>
