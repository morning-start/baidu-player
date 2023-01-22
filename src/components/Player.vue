<template>
  <video :src="videoSrc[defIndex]" ref="video" :width="videoInfo.width" :currentTime="currentTime" />
  <!-- <canvas ref="canvas"></canvas> -->
  <div class="definition">
    <a-dropdown placement="top">
      <a class="ant-dropdown-link" @click.prevent>
        {{ definition[defIndex] }}
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item v-for="item, index in definition">
            <a href="javascript:;" @click.prevent="switchDef(index)">{{ item }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
  <input ref="range" type="range" min="0" :max="duration" :value="currentTime">
  <!-- <button @click="play">play</button><button @click="pause">pause</button> -->
</template>

<script setup>
import { ref, onMounted } from 'vue';

let videoInfo = {
  width: 500, // 视频宽度
}
// let canvas = ref(null) // canvas 对象
let video = ref(null)// video 对象
let duration = ref(0) // 总时长
let range = ref(null) // range 对象

// console.log(video);

onMounted(() => {
  video.value.addEventListener('loadedmetadata', () => {
    /* 视频基本信息加载完成 */
    duration.value = video.value.duration
    // 视频长宽
    console.log(video.value.videoWidth, video.value.videoHeight);
    // console.log(video.value.duration);
  })
})

// SECTION 切换清晰度
let definition = ['流畅', '标清', '高清']
let videoSrc = ['', '/public/《崩坏3》识之律者.mp4', '']

let defIndex = ref(1);
let currentTime = ref(0) // 当前播放时间

function switchDef(i) {
  if (i == defIndex.value) return;// 防止重复点击
  defIndex.value = i;
  // console.log(i);
}

// TODO 对于没有src的video设置menu为disabled

// !SECTION
</script>

<style scoped>

</style>
