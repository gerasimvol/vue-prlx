let requestAnimationFrameId

// VUE DIRECTIVE DEFINITION
export default {
  bind: function (el, { modifiers, value }) {
    // SETUP SETTING

    const settings = {
      // {boolean} – enable parallax on mobile
      isParallaxOnMobile: _get(modifiers, 'mobile', false),
      // {boolean} – animate background-position instead of translate
      background: _get(modifiers, 'background', false),
      // {boolean} – start parallax from very bottom of the page instead of middle
      startParallaxFromBottom: _get(value, 'fromBottom', false),
      // {number} – parallax power
      speed: _get(value, 'speed', 0.15),
      // {boolean} – can parallax to negative values
      preserveInitialPosition: _get(value, 'preserveInitialPosition', true),
      // {string} – 'x' - horizontal parallax, 'y' - vertical
      direction: _get(value, 'direction', 'y'),
      // {object} – limit.min, limit.max offset
      limit: _get(value, 'limit', null),
      // {number} – mobile max width
      mobileMaxWidth: _get(value, 'mobileMaxWidth', 768)
    }

    // REDUCE SPEED FOR BACKGROUND PARALLAX
    if (settings.background) {
      settings.speed = 0.02
      settings.limit = {
        min: 0,
        max: 100
      }
    }

    const shouldParallax = !(window.innerWidth < 768 && !settings.isParallaxOnMobile)
    if (shouldParallax) {
      init(el, settings)
    }
  },
  
  unbind: function () {
    window.cancelAnimationFrame(requestAnimationFrameId)
  }
}

// HELPER FUNCTIONS
function init (el, settings) {
  // START PARALLAX FROM MIDDLE OR BOTTOM OF THE SCREEN
  const startingPoint = settings.startParallaxFromBottom
    ? window.innerHeight
    : (window.innerHeight / 2)

  const pageYOffset = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
  let scrollPosition = pageYOffset - el.offsetTop + startingPoint

  // DON'T PARALLAX TO NEGATIVE VALUES (START PARALLAX FROM INITIAL DOM POSITION)
  if (settings.preserveInitialPosition) {
    if (scrollPosition < 0) scrollPosition = 0
  }

  // PARALLAX ONLY IN VIEWPORT
  if (isInViewport(el)) {
    animate(el, scrollPosition, settings)
  }

  requestAnimationFrameId = window.requestAnimationFrame(init.bind(null, el, settings))
}

function animate (el, scrollPosition, settings) {
  let offset = scrollPosition * settings.speed

  // NORMALIZE OFFSET
  if (settings.limit) {
    if (offset > settings.limit.max) offset = settings.limit.max
    if (offset < settings.limit.min) offset = settings.limit.min
  }

  // RUN PARALLAX
  const parallaxType = settings.background
    ? parallaxBackgroundPosition
    : parallaxTransform
  parallaxType(el, offset, settings.direction)
}

function parallaxBackgroundPosition (el, offset, direction) {
  el.style.transition = `background-position 0.1s ease-out`

  if (direction === 'y') {
    el.style.backgroundPosition = `50% ${offset}%`
  } else {
    el.style.backgroundPosition = `${offset}% 50%`
  }
}

function parallaxTransform (el, offset, direction) {
  el.style.transition = `transform 0.1s ease-out`
  el.style.transform = `translate${direction.toUpperCase()}(${offset}px)`
}

const isInViewport = (el, { top: t, height: h } = el.getBoundingClientRect()) => t <= innerHeight && t + h >= 0

const _get = (obj, path, defaultValue = null) =>
  String.prototype.split.call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((a, c) => (Object.hasOwnProperty.call(a,c) ? a[c] : defaultValue), obj)