var requestAnimationFrameId;
var directive = {
  bind: function bind(el, _ref) {
    var modifiers = _ref.modifiers,
        value = _ref.value;
    var settings = {
      isParallaxOnMobile: _get(modifiers, 'mobile', false),
      background: _get(modifiers, 'background', false),
      startParallaxFromBottom: _get(value, 'fromBottom', false),
      speed: _get(value, 'speed', 0.15),
      preserveInitialPosition: _get(value, 'preserveInitialPosition', true),
      direction: _get(value, 'direction', 'y'),
      limit: _get(value, 'limit', null),
      mobileMaxWidth: _get(value, 'mobileMaxWidth', 768)
    };

    if (settings.background) {
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
};

function init(el, settings) {
  var startingPoint = settings.startParallaxFromBottom ? window.innerHeight : window.innerHeight / 2;
  var pageYOffset = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  var scrollPosition = pageYOffset - el.offsetTop + startingPoint;

  if (settings.preserveInitialPosition) {
    if (scrollPosition < 0) scrollPosition = 0;
  }

  if (isInViewport(el)) {
    animate(el, scrollPosition, settings);
  }

  requestAnimationFrameId = window.requestAnimationFrame(init.bind(null, el, settings));
}

function animate(el, scrollPosition, settings) {
  var offset = scrollPosition * settings.speed;

  if (settings.limit) {
    if (offset > settings.limit.max) offset = settings.limit.max;
    if (offset < settings.limit.min) offset = settings.limit.min;
  }

  var parallaxType = settings.background ? parallaxBackgroundPosition : parallaxTransform;
  parallaxType(el, offset, settings.direction);
}

function parallaxBackgroundPosition(el, offset, direction) {
  el.style.transition = "background-position 0.1s ease-out";

  if (direction === 'y') {
    el.style.backgroundPosition = "50% ".concat(offset, "%");
  } else {
    el.style.backgroundPosition = "".concat(offset, "% 50%");
  }
}

function parallaxTransform(el, offset, direction) {
  el.style.transition = "transform 0.1s ease-out";
  el.style.transform = "translate".concat(direction.toUpperCase(), "(").concat(offset, "px)");
}

var isInViewport = function isInViewport(el) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : el.getBoundingClientRect(),
      t = _ref2.top,
      h = _ref2.height;

  return t <= innerHeight && t + h >= 0;
};

var _get = function _get(obj, path) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return String.prototype.split.call(path, /[,[\].]+?/).filter(Boolean).reduce(function (a, c) {
    return Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue;
  }, obj);
};

var _plugin = (function (Vue) {
  Vue.directive('prlx', directive);
});

export default _plugin;
export { _plugin as VuePrlx, directive as VuePrlxDirective };
