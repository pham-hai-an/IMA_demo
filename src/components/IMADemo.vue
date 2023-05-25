<template>
  <swiper
    :navigation="true"
    :modules="modules"
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
      />
      <VideoPlayer
        v-else
        :key="v.id"
        :options="v.options"
        data-type="video"
        @ended="onEnded"
      ></VideoPlayer>
    </swiper-slide>
  </swiper>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref, defineExpose } from 'vue';
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

let swp;
const onSwiper = (swiper) => {
  swp = swiper;
};

const onAdComplete = () => {
  swp.slideNext();
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

let videoSlides = [];

const onSlideChange = (swiper) => {
  console.log('slide change');
  let slideEls = document.querySelectorAll('.swiper-slide .video-js');
  slideEls = Array.from(slideEls);
  slideEls.forEach((s) => {
    const video = s.querySelector('video');
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
    adRef.value.playAds();
  } else {
    // adRef.value.pause();
  }

  const activeVideo = document.querySelector(
    '.swiper-slide.swiper-slide-active video'
  );
  if (activeVideo) {
    activeVideo.play();
  }
};
const onEnded = () => {};
onMounted(() => {
  // variable
  var timeout = null;
  var waiting = 3000;

  let videos = [
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 1 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 2 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 3 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 4 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 5 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 6 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 7 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 8 },
    { src: 'http://techslides.com/demos/sample-videos/small.mp4', id: 9 },
  ];

  videos = videos.map((v, i) => {
    const options = {
      ...videoOptions(),
      sources: [{ src: v.src, type: 'video/mp4' }],
    };
    if (i === 0) {
      options.autoplay = true;
    }
    return {
      ...v,
      options,
    };
  });
  const injectIndex = 2;
  videoSlides = [
    ...videos.slice(0, injectIndex),
    { isAd: true, adTagURL: '' },
    ...videos.slice(injectIndex),
  ];

  // swiper object
  // swiper.on('slideChangeTransitionEnd', function () {
  //   var index = swiper.activeIndex;
  //   var currentSlide = $(swiper.slides[index]);
  //   var currentSlideType = currentSlide.data('slide-type');

  //   clearTimeout(timeout);

  //   switch (currentSlideType) {
  //     case 'img':
  //       runNext();
  //       break;
  //     case 'vdo':
  //       player.currentTime(0);
  //       player.play();
  //       videoPlayStatus = VIDEO_PLAYING_STATE.PLAYING;
  //       break;
  //     default:
  //       throw new Error('invalid slide type');
  //   }
  // });
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
