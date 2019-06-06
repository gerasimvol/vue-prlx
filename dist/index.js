'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestAnimationFrameId = void 0;

exports.default = _vue2.default.directive('prlx', {
  bind: function bind(el, _ref, _ref2) {
    var modifiers = _ref.modifiers,
        value = _ref.value;
    var context = _ref2.context;

    // SETUP SETTING

    var settings = {
      // {boolean} – enable parallax on mobile
      isParallaxOnMobile: (0, _lodash2.default)(modifiers, 'mobile', false),
      // {boolean} – animate background-position instead of translate
      background: (0, _lodash2.default)(modifiers, 'background', false),
      // {boolean} – start parallax from very bottom of the page instead of middle
      startParallaxFromBottom: (0, _lodash2.default)(value, 'fromBottom', false),
      // {number} – parallax power
      speed: (0, _lodash2.default)(value, 'speed', 0.15),
      // {boolean} – can parallax to negative values
      preserveInitialPosition: (0, _lodash2.default)(value, 'preserveInitialPosition', true),
      // {string} – 'x' - horizontal parallax, 'y' - vertical
      direction: (0, _lodash2.default)(value, 'direction', 'y'),
      // {object} – limit.min, limit.max offset
      limit: (0, _lodash2.default)(value, 'limit', null),
      // {number} – mobile max width
      mobileMaxWidth: (0, _lodash2.default)(value, 'mobileMaxWidth', 768)

      // REDUCE SPEED FOR BACKGROUND PARALLAX
    };if (settings.background) {
      settings.speed = 0.02;
      settings.limit = {
        min: 0,
        max: 100
      };
    }

    var shouldParallax = !(window.innerWidth < 768 && !settings.isParallaxOnMobile);
    if (shouldParallax) {
      init(el, settings);
    }
  },

  unbind: function unbind() {
    window.cancelAnimationFrame(requestAnimationFrameId);
  }
});


function init(el, settings) {
  // START PARALLAX FROM MIDDLE OR BOTTOM OF THE SCREEN
  var startingPoint = settings.startParallaxFromBottom ? window.innerHeight : window.innerHeight / 2;

  var pageYOffset = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  var scrollPosition = pageYOffset - el.offsetTop + startingPoint;

  // DON'T PARALLAX TO NEGATIVE VALUES (START PARALLAX FROM INITIAL DOM POSITION)
  if (settings.preserveInitialPosition) {
    if (scrollPosition < 0) scrollPosition = 0;
  }

  // PARALLAX ONLY IN VIEWPORT
  if (isInViewport(el)) {
    animate(el, scrollPosition, settings);
  }

  requestAnimationFrameId = window.requestAnimationFrame(init.bind(null, el, settings));
}

function animate(el, scrollPosition, settings) {
  var offset = scrollPosition * settings.speed;

  // NORMALIZE OFFSET
  if (settings.limit) {
    if (offset > settings.limit.max) offset = settings.limit.max;
    if (offset < settings.limit.min) offset = settings.limit.min;
  }

  // RUN PARALLAX
  var parallaxType = settings.background ? parallaxBackgroundPosition : parallaxTransform;
  parallaxType(el, offset, settings.direction);
}

function parallaxBackgroundPosition(el, offset, direction) {
  el.style.transition = 'background-position 0.1s ease-out';

  if (direction === 'y') {
    el.style.backgroundPosition = '50% ' + offset + '%';
  } else {
    el.style.backgroundPosition = offset + '% 50%';
  }
}

function parallaxTransform(el, offset, direction) {
  el.style.transition = 'transform 0.1s ease-out';
  el.style.transform = 'translate' + direction.toUpperCase() + '(' + offset + 'px)';
}

var isInViewport = function isInViewport(el) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : el.getBoundingClientRect(),
      t = _ref3.top,
      h = _ref3.height;

  return t <= innerHeight && t + h >= 0;
};