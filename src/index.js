import "./styles.css";

const SAFARI_SNAP_FIX_TIMEOUT = 200;

const $sections = document.querySelectorAll('.section');
const $sliders = document.querySelectorAll('.slider');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const initialHash = window.location.hash;

let currentSection = 0;
let isScrolling = false;
let scrollWheel = 0;


document.addEventListener('DOMContentLoaded', () => {
  if (!$sections.length || !$sliders.length) return;

  if (/Mobi|Movi|Android/i.test(navigator.userAgent)) { // Mobile devices
    if (window.addEventListener) {
      window.addEventListener("load", function () {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0);
      });
      window.addEventListener("orientationchange", function () {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 0);
      });
    }
  } else { // Desktop devices
    const observeSections = (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 1) {
          setTimeout(() => {
            scrollWheel = 0;
            isScrolling = false;
          }, 1000);
        }
      })
    }

    /* Safari fix to snap sections automatically (emulates auto-snap) */
    const snapSection = (direction = '') => {
      if (!direction) return;

      const slider = $sliders[currentSection];
      const pos = parseInt(slider.scrollLeft / slider.offsetWidth);
      const intersectionNextSlide = (slider.scrollLeft % slider.offsetWidth) / slider.offsetWidth;

      if (direction === 'next' && intersectionNextSlide >= 0.1) {
        const nextSlide = pos + 1;
        slider.scrollTo({ left: nextSlide * slider.offsetWidth, behavior: 'smooth' });
      } else if (direction === 'prev' && intersectionNextSlide <= 0.8) {
        const prevSlide = pos;
        slider.scrollTo({ left: prevSlide * slider.offsetWidth, behavior: 'smooth' });
      } else {
        slider.scrollTo({ left: pos * slider.offsetWidth, behavior: 'smooth' });
      }
      isScrolling = false;
    }

    const sectionsObserver = new IntersectionObserver(observeSections, { threshold: 1.0 });
    $sections.forEach(section => sectionsObserver.observe(section))

    let snapSectionTimer = null;

    document.addEventListener('wheel', (event) => {
      const slider = $sliders[currentSection];

      if (snapSectionTimer) clearTimeout(snapSectionTimer);

      if (event.deltaX !== 0 || isScrolling) return;

      if (event.deltaY > 0) { // Scroll down
        scrollWheel++;
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth || slider.scrollWidth - (slider.scrollLeft + slider.offsetWidth) === 1) { // Last slide
          if (currentSection < $sections.length - 1) { // Next section
            isScrolling = true;
            currentSection++;
            $sections[currentSection].scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          slider.scrollBy({ left: event.deltaY, behavior: 'smooth' });
          if (isSafari) { // Force snap behavior in Safari
            snapSectionTimer = setTimeout(() => {
              isScrolling = true;
              snapSection('next')
            }, SAFARI_SNAP_FIX_TIMEOUT);
          }
        }
      } else if (event.deltaY < 0) { // Scroll up
        scrollWheel--;
        if (slider.scrollLeft === 0) {
          if (currentSection > 0) { // Previous section
            isScrolling = true;
            currentSection--;
            $sections[currentSection].scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          slider.scrollBy({ left: event.deltaY, behavior: 'smooth' });
          if (isSafari) { // Force snap behavior in Safari
            snapSectionTimer = setTimeout(() => {
              isScrolling = true;
              snapSection('prev')
            }, SAFARI_SNAP_FIX_TIMEOUT);
          }
        }
      }

      if (!isSafari) {
        if (scrollWheel < -1 || scrollWheel > 1) {
          isScrolling = true;
          setTimeout(() => {
            scrollWheel = 0;
            isScrolling = false;
          }, 1000);
        }
      }

      /* Enable animations here */

    });

    if (initialHash) {
      const $slideToShow = document.querySelector(initialHash);
      if ($slideToShow) {
        $slideToShow.scrollIntoView({ behavior: 'smooth' });
        scrollWheel = 0;
        isScrolling = false;
      }
    }

    window.addEventListener('popstate', (event) => {
      if (location.hash && location.hash !== "") {
        const $slideToShow = document.querySelector(location.hash);
        if ($slideToShow) {
          setTimeout(() => {
            $slideToShow.scrollIntoView({ behavior: 'smooth' });
            scrollWheel = 0;
            isScrolling = false;
          }, 0);
        }
      }
    });

    const $giftsSecionVideo = document.querySelector('#love');
    if ($giftsSecionVideo) {
      $giftsSecionVideo.addEventListener('click', () => {
        if ( $giftsSecionVideo.paused ) {
          $giftsSecionVideo.play();
        } else {
          $giftsSecionVideo.pause();
        }
      });
    }
  }
});