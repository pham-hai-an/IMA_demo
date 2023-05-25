export function loadScript({ src, id }, callBack) {
  const d = document;
  const s = 'script';
  if (d.getElementById(id)) {
    if (callBack) callBack();
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = src;
  js.addEventListener('load', callBack);
  d.body.appendChild(js);
}

export function injectInlineStyle({ content, id }) {
  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = content;
  if (!document.getElementById(id)) {
    document.head.insertBefore(styleEl, document.head.firstChild);
  }
}

export function getVideoType(src) {
  const srcArray = (src || '').split('.');
  return srcArray[srcArray.length - 1];
}

export function isIOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

const USER_AGENT = window.navigator.userAgent || '';

export const TOUCH_ENABLED = Boolean(
  document === window.document &&
    ('ontouchstart' in window ||
      window.navigator.maxTouchPoints ||
      //@ts-ignore
      (window.DocumentTouch && window.document instanceof window.DocumentTouch))
);

export const IS_FIREFOX = /Firefox/i.test(USER_AGENT);

export const IS_EDGE = /Edg/i.test(USER_AGENT);

export const IS_CHROMIUM =
  /Chrome/i.test(USER_AGENT) || /CriOS/i.test(USER_AGENT);

export const IS_CHROME = !IS_EDGE && IS_CHROMIUM;

export const IS_ANDROID = /Android/i.test(USER_AGENT);

export const IS_SAFARI =
  /Safari/i.test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE;

export const IS_WINDOWS = /Windows/i.test(USER_AGENT);

export const IS_IPAD =
  /iPad/i.test(USER_AGENT) ||
  (IS_SAFARI && TOUCH_ENABLED && !/iPhone/i.test(USER_AGENT));

export const IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD;

export const IS_IPOD = /iPod/i.test(USER_AGENT);

export const IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;
