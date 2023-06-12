<template>
  <div id="main-container">
    <div id="adContainer"></div>
    <video id="contentElement" playsinline muted>
      <source src="http://techslides.com/demos/sample-videos/small.mp4" />
    </video>
  </div>
</template>

<script setup>
import { onMounted, defineEmits, defineExpose } from 'vue';
import { loadScript } from '../utils';
const emit = defineEmits(['complete', 'error', 'skipped']);

onMounted(() => {
  loadScript(
    {
      src: 'http://imasdk.googleapis.com/js/sdkloader/ima3.js',
      id: 'gg-ima3',
    },
    initDesktopAutoplayExample
  );
});

let adsManager;
let adsLoader;
let adDisplayContainer;
let playButton;
let videoContent;
let adsInitialized;
let autoplayAllowed;
let autoplayRequiresMuted;

/**
 * Initializes IMA setup.
 */
function initDesktopAutoplayExample() {
  videoContent = document.getElementById('contentElement');
  //   playButton = document.getElementById('playButton');
  //   playButton.addEventListener('click', () => {
  //     // Initialize the container. Must be done through a user action where
  //     // autoplay is not allowed.
  //     adDisplayContainer.initialize();
  //     adsInitialized = true;
  //     videoContent.load();
  //     playAds();
  //   });
  setUpIMA();
  // Check if autoplay is supported.
  checkAutoplaySupport();
}

/**
 * Attempts autoplay and handles success and failure cases.
 */
function checkAutoplaySupport() {
  // Test for autoplay support with our content player.
  const playPromise = videoContent.play();
  if (playPromise !== undefined) {
    playPromise.then(onAutoplayWithSoundSuccess).catch(onAutoplayWithSoundFail);
  }
}

/**
 * Handles case where autoplay succeeded with sound.
 */
function onAutoplayWithSoundSuccess() {
  // If we make it here, unmuted autoplay works.
  videoContent.pause();
  autoplayAllowed = true;
  autoplayRequiresMuted = false;
  autoplayChecksResolved();
}

/**
 * Handles case where autoplay fails with sound.
 */
function onAutoplayWithSoundFail() {
  // Unmuted autoplay failed. Now try muted autoplay.
  checkMutedAutoplaySupport();
}

/**
 * Checks if video can autoplay while muted.
 */
function checkMutedAutoplaySupport() {
  videoContent.volume = 0;
  videoContent.muted = true;
  const playPromise = videoContent.play();
  if (playPromise !== undefined) {
    playPromise.then(onMutedAutoplaySuccess).catch(onMutedAutoplayFail);
  }
}

/**
 * Handles case where autoplay succeeded while muted.
 */
function onMutedAutoplaySuccess() {
  // If we make it here, muted autoplay works but unmuted autoplay does not.
  videoContent.pause();
  autoplayAllowed = true;
  autoplayRequiresMuted = true;
  autoplayChecksResolved();
}

/**
 * Handles case where autoplay failed while muted.
 */
function onMutedAutoplayFail() {
  // Both muted and unmuted autoplay failed. Fall back to click to play.
  videoContent.volume = 1;
  videoContent.muted = false;
  autoplayAllowed = false;
  autoplayRequiresMuted = false;
  autoplayChecksResolved();
}

/**
 * Sets up IMA ad display container, ads loader, and makes an ad request.
 */
function setUpIMA() {
  google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true);
  // Create the ad display container.
  createAdDisplayContainer();
  // Create ads loader.
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  // Listen and respond to ads loaded and error events.
  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded,
    false
  );
  adsLoader.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError,
    false
  );

  // An event listener to tell the SDK that our content video
  // is completed so the SDK can play any post-roll ads.
  videoContent.onended = contentEndedListener;
}

/**
 * Handles content ending and calls adsLoader.contentComplete()
 */
function contentEndedListener() {
  videoContent.onended = null;
  if (adsLoader) {
    adsLoader.contentComplete();
  }
}

/**
 * Builds an ad request and uses it to request ads.
 */
function autoplayChecksResolved() {
  // Request video ads.
  const adsRequest = new google.ima.AdsRequest();
  //   adsRequest.adTagUrl =
  //     'https://pubads.g.doubleclick.net/gampad/ads?' +
  //     'iu=/21775744923/external/single_preroll_skippable&sz=640x480&' +
  //     'ciu_szs=300x250%2C728x90&gdfp_req=1&' +
  //     'output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

  adsRequest.adTagUrl =
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/nonlinear_ad_samples&sz=480x70&cust_params=sample_ct%3Dnonlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
  // Specify the linear and nonlinear slot sizes. This helps the SDK to
  // select the correct creative if multiple are returned.
  adsRequest.linearAdSlotWidth = 640;
  adsRequest.linearAdSlotHeight = 400;

  adsRequest.nonLinearAdSlotWidth = 640;
  adsRequest.nonLinearAdSlotHeight = 150;

  adsRequest.setAdWillAutoPlay(autoplayAllowed);
  adsRequest.setAdWillPlayMuted(autoplayRequiresMuted);
  adsLoader.requestAds(adsRequest);
}

/**
 * Sets the 'adContainer' div as the IMA ad display container.
 */
function createAdDisplayContainer() {
  // We assume the adContainer is the DOM id of the element that will house
  // the ads.
  adDisplayContainer = new google.ima.AdDisplayContainer(
    document.getElementById('adContainer'),
    videoContent
  );
}

const pause = () => {
  adsManager.pause();
};

const stop = () => {
  adsManager.stop();
};

const start = () => {
  adsManager.start();
};

function restartAdAtBeginning() {
  setUpIMA();
}
/**
 * Loads the video content and initializes IMA ad playback.
 */
function playAds() {
  try {
    if (!adsInitialized) {
      adDisplayContainer.initialize();
      adsInitialized = true;
    }
    // Initialize the ads manager. Ad rules playlist will start at this time.
    adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
    // Call play to start showing the ad. Single video and overlay ads will
    // start at this time; the call will be ignored for ad rules.
    adsManager.start();
  } catch (adError) {
    // An error may be thrown if there was a problem with the VAST response.
    // videoContent.play();
    console.log('play Ads error');
    emit('error');
  }
}

/**
 * Handles the ad manager loading and sets ad event listeners.
 * @param {!google.ima.AdsManagerLoadedEvent} adsManagerLoadedEvent
 */
function onAdsManagerLoaded(adsManagerLoadedEvent) {
  // Get the ads manager.
  const adsRenderingSettings = new google.ima.AdsRenderingSettings();
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  // videoContent should be set to the content video element.
  adsManager = adsManagerLoadedEvent.getAdsManager(
    videoContent,
    adsRenderingSettings
  );
  // Mute the ad if doing muted autoplay.
  const adVolume = autoplayAllowed && autoplayRequiresMuted ? 0 : 1;
  adsManager.setVolume(adVolume);

  // Add listeners to the required events.
  adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    onContentPauseRequested
  );
  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    onContentResumeRequested
  );
  adsManager.addEventListener(
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    onAdEvent
  );

  // Listen to any additional events, if necessary.
  adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdEvent);
  adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdEvent);
  adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEvent);
  adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdEvent);

  //   if (autoplayAllowed) {
  //     playAds();
  //   } else {
  //     // playButton.style.display = 'block';
  //     console.log('not support autoplay');
  //   }
  //   setTimeout(() => {
  //     pause();
  //   }, 100);
}

/**
 * Handles actions taken in response to ad events.
 * @param {!google.ima.AdEvent} adEvent
 */
function onAdEvent(adEvent) {
  // Retrieve the ad from the event. Some events (for example,
  // ALL_ADS_COMPLETED) don't have ad object associated.

  const ad = adEvent.getAd();
  switch (adEvent.type) {
    case google.ima.AdEvent.Type.LOADED:
      // This is the first event sent for an ad - it is possible to
      // determine whether the ad is a video ad or an overlay.
      //   if (!ad.isLinear()) {
      //     // Position AdDisplayContainer correctly for overlay.
      //     // Use ad.width and ad.height.
      //     videoContent.play();
      //   }
      break;
    case google.ima.AdEvent.Type.STARTED:
      // This event indicates the ad has started - the video player
      // can adjust the UI, for example display a pause button and
      // remaining time.
      //   if (ad.isLinear()) {
      //     // For a linear ad, a timer can be started to poll for
      //     // the remaining time.
      //     intervalTimer = setInterval(function () {
      //       // Example: const remainingTime = adsManager.getRemainingTime();
      //     }, 300); // every 300ms
      //   }
      break;
    case google.ima.AdEvent.Type.COMPLETE:
      // This event indicates the ad has finished - the video player
      // can perform appropriate UI actions, such as removing the timer for
      // remaining time detection.
      //   if (ad.isLinear()) {
      //     clearInterval(intervalTimer);
      //   }
      console.log('ads complete');
      emit('complete');
      break;

    case google.ima.AdEvent.Type.SKIPPED:
      emit('skipped');
  }
}

/**
 * Handles ad errors.
 * @param {!google.ima.AdErrorEvent} adErrorEvent
 */
function onAdError(adErrorEvent) {
  // Handle the error logging.
  console.log(adErrorEvent.getError());
  emit('error');
  adsManager.destroy();
  // Fall back to playing content.
  //   videoContent.play();
}

/**
 * Pauses video content and sets up ad UI.
 */
function onContentPauseRequested() {
  videoContent.pause();
  videoContent.onended = null;
}

/**
 * Resumes video content and removes ad UI.
 */
function onContentResumeRequested() {
  //   videoContent.play();
  videoContent.onended = contentEndedListener;
}

defineExpose({ playAds, pause, start, stop, restartAdAtBeginning });
</script>

<style lang="scss" scoped>
#main-container {
  position: relative;
}

#adContainer {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
</style>
