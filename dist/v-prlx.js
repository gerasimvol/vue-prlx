(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VuePrlx = {}));
}(this, function (exports) { 'use strict';

  var directive = {
    bind: onBind,
    update: onBind,
    unbind: onUnbind
  };

  function onUnbind(el) {
    window.cancelAnimationFrame(el.__prlxRequestAnimationFrameId);
    delete el.__prlxRequestAnimationFrameId;
  }

  function onBind(el, _ref) {
    var _ref$modifiers = _ref.modifiers,
        modifiers = _ref$modifiers === void 0 ? {} : _ref$modifiers,
        _ref$value = _ref.value,
        value = _ref$value === void 0 ? {} : _ref$value;
    var settings = {
      isParallaxOnMobile: modifiers.mobile || false,
      background: modifiers.background || false,
      startParallaxFromBottom: value.fromBottom || false,
      justAddParallaxValue: value.custom || false,
      reverse: value.reverse || false,
      speed: value.speed || 0.15,
      preserveInitialPosition: value.preserveInitialPosition === false ? value.preserveInitialPosition : true,
      direction: value.direction || 'y',
      limit: value.limit || null,
      mobileMaxWidth: value.mobileMaxWidth || 768,
      isDisabled: value.disabled || false
    };

    if (settings.background) {
      settings.speed = value.speed || 0.02;
      settings.limit = {
        min: 0,
        max: 100
      };
    }

    if (settings.reverse) {
      settings.speed = -settings.speed;
    }

    if (settings.isDisabled) {
      onUnbind(el);
    } else {
      var isMobile = window.innerWidth < settings.mobileMaxWidth;
      var shouldParallax = isMobile ? settings.isParallaxOnMobile : true;

      if (shouldParallax) {
        init(el, settings);
      }
    }
  }

  function init(el, settings) {
    var startingPoint = settings.startParallaxFromBottom ? window.innerHeight : window.innerHeight / 2;
    var pageYOffset = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    var scrollPosition = pageYOffset - offsetTopFromWindow(el) + startingPoint;

    if (settings.preserveInitialPosition) {
      if (scrollPosition < 0) scrollPosition = 0;
    }

    if (isInViewport(el)) {
      animate(el, scrollPosition, settings);
    }

    el.__prlxRequestAnimationFrameId = window.requestAnimationFrame(init.bind(null, el, settings));
  }

  function animate(el, scrollPosition, settings) {
    var offset = scrollPosition * settings.speed;

    if (settings.limit) {
      if (offset > settings.limit.max) offset = settings.limit.max;
      if (offset < settings.limit.min) offset = settings.limit.min;
    }

    var parallaxType;

    if (settings.background) {
      parallaxType = parallaxBackgroundPosition;
    } else if (settings.justAddParallaxValue) {
      parallaxType = addParallaxValueAsCssVariable;
    } else {
      parallaxType = parallaxTransform;
    }

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
    el.style.transform = "translate".concat(direction.toUpperCase(), "(").concat(Math.round(offset), "px)");
  }

  function addParallaxValueAsCssVariable(el, offset) {
    el.style.setProperty('--parallax-value', offset);
  }

  var isInViewport = function isInViewport(el) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : el.getBoundingClientRect(),
        t = _ref2.top,
        h = _ref2.height;

    return t <= innerHeight && t + h > 0;
  };

  var offsetTopFromWindow = function offsetTopFromWindow(element) {
    var top = 0;

    do {
      top += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);

    return top;
  };

  var _plugin = (function (Vue) {
    Vue.directive('prlx', directive);
  });

  exports.VuePrlx = _plugin;
  exports.VuePrlxDirective = directive;
  exports.default = _plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
