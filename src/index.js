import "./styles.css";

const SAFARI_SNAP_FIX_TIMEOUT = 150;

const $sections = document.querySelectorAll('.section');
const $sliders = document.querySelectorAll('.slider');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const initialHash = window.location.hash;

let currentSection = 0;
let isScrolling = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!$sections.length || !$sliders.length) return;

  if (/Mobi|Movi|Android/i.test(navigator.userAgent)) { // Mobile devices
    document.documentElement.classList.add('mobile'); // add class 'mobile' to html tag
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
    const attachSlidesEvents = () => {
      if (slidesObserver) {
        slidesObserver.disconnect();
      }
      $sections[currentSection].querySelectorAll('.slide').forEach(slide => slidesObserver.observe(slide))
    }

    const observeSlides = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-animated');
        }
        if (!entry.isIntersecting) {
          entry.target.classList.remove('slide-animated');
        }
      })
    }

    const observeSections = (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 1) {
          setTimeout(() => {
            isScrolling = false;
            attachSlidesEvents();
          }, 600);
        }
        if (entry.isIntersecting) {
          isScrolling = false;
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
    const slidesObserver = new IntersectionObserver(observeSlides, { threshold: 1.0 });
    $sections.forEach(section => sectionsObserver.observe(section))

    let snapSectionTimer = null;

    document.addEventListener('wheel', (event) => {
      const slider = $sliders[currentSection];

      if (event.deltaX !== 0 || isScrolling) return;

      if (event.deltaY > 0) { // Scroll down
        if ( slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth
          || slider.scrollWidth - (slider.scrollLeft + slider.offsetWidth) === 1) { // Last slide
          if (currentSection < $sections.length - 1) { // Next section
            isScrolling = true;
            currentSection++;
            $sections[currentSection].scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          slider.scrollBy({ left: event.deltaY, behavior: isSafari ? 'auto' : 'smooth' });
          if (isSafari) { // Force snap behavior in Safari
            clearTimeout(snapSectionTimer);
            snapSectionTimer = setTimeout(() => {
              isScrolling = true;
              snapSection('next')
            }, SAFARI_SNAP_FIX_TIMEOUT);
          }
        }
      } else if (event.deltaY < 0) { // Scroll up
        if (slider.scrollLeft === 0) {
          if (currentSection > 0) { // Previous section
            isScrolling = true;
            currentSection--;
            $sections[currentSection].scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          slider.scrollBy({ left: event.deltaY, behavior: isSafari ? 'auto' : 'smooth' });
          if (isSafari) { // Force snap behavior in Safari
            clearTimeout(snapSectionTimer);
            snapSectionTimer = setTimeout(() => {
              isScrolling = true;
              snapSection('prev')
            }, SAFARI_SNAP_FIX_TIMEOUT);
          }
        }
      }
    });

    if (initialHash) {
      const $slideToShow = document.querySelector(initialHash);
      if ($slideToShow) {
        $slideToShow.scrollIntoView({ behavior: 'smooth' });
        isScrolling = false;
        $slideToShow.classList.add('slide-animated');
        $slideToShow.previousElementSibling?.classList?.add('slide-animated');

        const $section = $slideToShow.closest('.section');
        currentSection = Array.from($sections).indexOf($section);
      }
    }

    window.addEventListener('popstate', (event) => {
      if (location.hash && location.hash !== "") {
        const $slideToShow = document.querySelector(location.hash);
        if ($slideToShow) {
          setTimeout(() => {
            $slideToShow.scrollIntoView({ behavior: 'smooth' });
            isScrolling = false;
          }, 0);
        }
      }
    });

    const $giftsSectionVideo = document.querySelector('#love');
    if ($giftsSectionVideo) {
      $giftsSectionVideo.setAttribute('stopped', '');
      $giftsSectionVideo.addEventListener('click', () => {
        if ($giftsSectionVideo.paused) {
          $giftsSectionVideo.play();
          if ( $giftsSectionVideo.hasAttribute('stopped') ) {
            $giftsSectionVideo.removeAttribute('stopped');
          }
        } else {
          $giftsSectionVideo.pause();
        }
      });
      $giftsSectionVideo.addEventListener('mouseenter', () => {
        // do nothing if video is stopped (poster)
        if ($giftsSectionVideo.hasAttribute('stopped')) return;
        // show controls only if video is playing
        $giftsSectionVideo.setAttribute("controls", "");
      });
      $giftsSectionVideo.addEventListener('mouseleave', () => {
        $giftsSectionVideo.removeAttribute("controls");
      });
    }
  }
});