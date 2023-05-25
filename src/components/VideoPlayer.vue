<template>
  <video ref="videoRef" class="video-js"></video>
</template>

<script>
import { ref, toRefs } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { onMounted } from 'vue';

const defaultOptions = () => ({
  controls: true,
  sources: [
    {
      src: '',
      type: 'video/mp4',
    },
  ],
});
export default {
  props: {
    options: Object,
    autoplay: Boolean,
  },
  setup(props, { emit }) {
    const videoRef = ref(null);

    onMounted(() => {
      var VIDEO_PLAYING_STATE = {
        PLAYING: 'PLAYING',
        PAUSE: 'PAUSE',
      };
      var videoPlayStatus = VIDEO_PLAYING_STATE.PAUSE;
      const { options } = toRefs(props);
      const player = videojs(videoRef.value, {
        ...defaultOptions(),
        ...options.value,
      });
      player.on('ended', function () {
        //   next();
        emit('ended');
      });
      player.on('canplay', () => {
        if (options.value.autoplay) {
          player.play();
        }
      });
    });

    function autoplay(value) {
      player.autoplay(value);
    }

    return { videoRef, autoplay };
  },
};
</script>

<style lang="scss" scoped></style>
