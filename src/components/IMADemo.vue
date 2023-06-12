<template>
  <swiper
    :navigation="true"
    :modules="modules"
    :direction="'vertical'"
    class="mySwiper"
    @swiper="onSwiper"
    @slideChangeTransitionEnd="onSlideChange"
  >
    <swiper-slide v-for="v in videoSlides" :key="v.id">
      <AdVideo
        v-if="v.isAd"
        ref="adRef"
        class="ad-video"
        @complete="onAdComplete"
        @error="onAdComplete"
        @skipped="onAdComplete"
      />
      <VideoPlayer
        v-else
        :key="v.id"
        :options="v.options"
        :index="v.id"
        data-type="video"
        @ended="onEnded"
      ></VideoPlayer>
    </swiper-slide>
  </swiper>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue';
import { ref, defineExpose, nextTick } from 'vue';
import VideoPlayer from './VideoPlayer.vue';
import AdVideo from './AdVideo.vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper';
import { onMounted } from 'vue';

const modules = [Navigation];

const adRef = ref(null);
let videoSlides = ref([]);

const injectIndex = 2;

let swp;
const onSwiper = (swiper) => {
  swp = swiper;
};

const onAdComplete = () => {
  swp.slideNext();
  // swp.removeSlide(injectIndex);
  videoSlides.value.splice(injectIndex, 1);
  nextTick(() => {
    swp.update();
  });
};

const videoOptions = () => ({
  controls: true,
  sources: [
    {
      src: '',
      type: 'video/mp4',
    },
  ],
});

function onSlideChange(swiper) {
  swp = swiper;
  console.log('slide change');
  let slideEls = document.querySelectorAll('.swiper-slide .video-js');
  slideEls = Array.from(slideEls);
  slideEls.forEach((s) => {
    const video = s.querySelector('video');
    console.log('foreach video');
    if (video) {
      video.currentTime = 0;
      video.setAttribute('autoplay', false);
      video.pause();
    }
  });

  const activeAdEl = document.querySelector(
    ' .swiper-slide.swiper-slide-active  .ad-video'
  );
  if (activeAdEl) {
    adRef.value[0].playAds();
    setTimeout(() => {
      adRef.value[0].pause();
    }, 3000);
  } else if (adRef) {
    const adEl = document.querySelector(' .swiper-slide  .ad-video');
    if (adEl) {
      adRef.value[0].pause();
    }
  }

  const activeVideo = document.querySelector(
    '.swiper-slide.swiper-slide-active video'
  );

  console.log({ activeVideo });

  if (activeVideo) {
    activeVideo.play();
  }
}
const onEnded = () => {};
onMounted(() => {
  // variable
  var timeout = null;
  var waiting = 3000;

  let videos = [
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 1 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 2 },
    {
      src: 'https://storage.googleapis.com/gvabox/media/samples/stock.mp4',
      id: 3,
    },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 4 },
    {
      src: 'https://storage.googleapis.com/gvabox/media/samples/stock.mp4',
      id: 5,
    },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 6 },
    {
      src: 'https://storage.googleapis.com/gvabox/media/samples/stock.mp4',
      id: 7,
    },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 8 },
    {
      src: 'https://storage.googleapis.com/gvabox/media/samples/stock.mp4',
      id: 9,
    },
  ];

  videos = videos.map((v, i) => {
    const options = {
      ...videoOptions(),
      sources: [{ src: v.src, type: 'video/mp4' }],
    };
    // if (i === 0) {
    //   options.autoplay = true;
    // }
    return {
      ...v,
      options,
    };
  });
  videoSlides.value = [
    ...videos.slice(0, injectIndex),
    { isAd: true, adTagURL: '' },
    ...videos.slice(injectIndex),
  ];
});

// global function
// function prev() {
//   swiper.slidePrev();
// }

// function next() {
//   swiper.slideNext();
// }

// function runNext() {
//   timeout = setTimeout(function () {
//     next();
//   }, waiting);
// }

defineExpose({ adRef });
</script>

<style lang="scss">
html,
body {
  position: relative;
  height: 100%;
}
body {
  background: #eee;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.x,
.y {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
.y {
  left: 70px;
}

.video-js video {
  width: 100%;
  // height: 100%;
  // object-fit: contain;
}

video {
  width: 100%;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
