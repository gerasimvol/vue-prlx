// VUE DIRECTIVE DEFINITION
export default {
  bind: onBind,

  update: onBind,

  unbind: onUnbind
}

// FUNCTIONS

function onUnbind (el) {
  window.cancelAnimationFrame(el.__prlxRequestAnimationFrameId)
  delete el.__prlxRequestAnimationFrameId
}

function onBind (el, { modifiers = {}, value = {} }) {
  // SETUP SETTING
  const settings = {
    // {boolean} – enable parallax on mobile
    isParallaxOnMobile: modifiers.mobile || false,

    // {boolean} – animate background-position instead of translate
    background: modifiers.background || false,

    // {boolean} – start parallax from very bottom of the page instead of middle
    startParallaxFromBottom: value.fromBottom || false,

    // {boolean} – just add '--parallax-value' css variable to element for your custom animations
    // so add css for example: transform: scale(calc(var(--parallax-value) / 50 ))
    justAddParallaxValue: value.custom || false,

    // {boolean} – reverse direction
    reverse: value.reverse || false,

    // {number} – parallax power
    speed: value.speed || 0.15,

    // {boolean} – can parallax to negative values
    preserveInitialPosition: value.preserveInitialPosition === false
      ? value.preserveInitialPosition
      : true,

    // {string} – 'x' - horizontal parallax, 'y' - vertical
    direction: value.direction || 'y',

    // {object} – limit.min, limit.max offset
    limit: value.limit || null,

    // {number} – mobile max width
    mobileMaxWidth: value.mobileMaxWidth || 768,

    // {boolean} – is parallax disabled
    isDisabled: value.disabled || false
  }

  // DEFAULT SETTINGS FOR BACKGROUND-POSITION
  if (settings.background) {
    settings.speed = value.speed || 0.02
    settings.limit = {
      min: 0,
      max: 100
    }
  }

  // REVERSE DIRECTION
  if (settings.reverse) {
    settings.speed = -settings.speed
  }

  if (settings.isDisabled) {
    onUnbind(el)
  } else {
    const isMobile = window.innerWidth < settings.mobileMaxWidth
    const shouldParallax = isMobile
      ? settings.isParallaxOnMobile
      : true
    if (shouldParallax) {
      init(el, settings)
    }
  }
}

function init (el, settings) {
  // START PARALLAX FROM MIDDLE OR BOTTOM OF THE SCREEN
  const startingPoint = settings.startParallaxFromBottom
    ? window.innerHeight
    : (window.innerHeight / 2)

  const pageYOffset = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
  let scrollPosition = pageYOffset - offsetTopFromWindow(el) + startingPoint

  // DON'T PARALLAX TO NEGATIVE VALUES (START PARALLAX FROM INITIAL DOM POSITION)
  if (settings.preserveInitialPosition) {
    if (scrollPosition < 0) scrollPosition = 0
  }

  // PARALLAX ONLY IN VIEWPORT
  if (isInViewport(el)) {
    animate(el, scrollPosition, settings)
  }

  el.__prlxRequestAnimationFrameId = window.requestAnimationFrame(init.bind(null, el, settings))
}

function animate (el, scrollPosition, settings) {
  let offset = scrollPosition * settings.speed

  // NORMALIZE OFFSET
  if (settings.limit) {
    if (offset > settings.limit.max) offset = settings.limit.max
    if (offset < settings.limit.min) offset = settings.limit.min
  }

  // RUN PARALLAX
  let parallaxType

  if (settings.background) {
    parallaxType = parallaxBackgroundPosition
  } else if (settings.justAddParallaxValue) {
    parallaxType = addParallaxValueAsCssVariable
  } else {
    parallaxType = parallaxTransform
  }

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
  el.style.transform = `translate${direction.toUpperCase()}(${Math.round(offset)}px)`
}

function addParallaxValueAsCssVariable (el, offset) {
  el.style.setProperty('--parallax-value', offset)
}

const isInViewport = (el, { top: t, height: h } = el.getBoundingClientRect()) => t <= innerHeight && t + h > 0

const offsetTopFromWindow = element => {
  let top = 0
  do {
    top += element.offsetTop || 0
    element = element.offsetParent
  } while (element)

  return top
}
