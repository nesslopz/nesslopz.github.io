import "./styles.css";

const SNAP_FIX_TIMEOUT = 1000;

const $sections = document.querySelectorAll('.section');
const $sliders = document.querySelectorAll('.slider');
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const initialHash = window.location.hash;

let currentSection = 0;
let isScrolling = false;
let snapSectionTimer = null;

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
          clearTimeout(snapSectionTimer);
          snapSectionTimer = setTimeout(() => {
            isScrolling = false;
          }, SNAP_FIX_TIMEOUT);
        }
        if (!entry.isIntersecting) {
          entry.target.classList.remove('slide-animated');
        }
      })
    }

    const observeSections = (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 1) {
          attachSlidesEvents();
          clearTimeout(snapSectionTimer);
          snapSectionTimer = setTimeout(() => {
            isScrolling = false;
          }, SNAP_FIX_TIMEOUT);
        }
      })
    }

    /* fix to snap sections automatically (emulates auto-snap) */
    const snapSection = (direction = '') => {
      if (!direction) return;

      isScrolling = true;
      const slider = $sliders[currentSection];
      const pos = parseInt(slider.scrollLeft / slider.offsetWidth);

      if (direction === 'next') {
        const nextSlide = pos + 1;
        slider.scrollTo({ left: nextSlide * slider.offsetWidth, behavior: 'smooth' });
      } else if (direction === 'prev') {
        const prevSlide = pos - 1;
        slider.scrollTo({ left: prevSlide * slider.offsetWidth, behavior: 'smooth' });
      }
    }

    const sectionsObserver = new IntersectionObserver(observeSections, { threshold: 1.0 });
    const slidesObserver = new IntersectionObserver(observeSlides, { threshold: 1.0 });
    $sections.forEach(section => sectionsObserver.observe(section))

    setInterval(() => {
      // Prevent to block scroll after a while
      if (!snapSectionTimer && isScrolling) {
        isScrolling = false;
      }
    }, SNAP_FIX_TIMEOUT * 3);

    document.addEventListener('wheel', (event) => {
      const slider = $sliders[currentSection];

      if (event.deltaX !== 0 || isScrolling) return;

      if (event.deltaY > 0) { // Scroll down
        if ( slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth
          || slider.scrollWidth - (slider.scrollLeft + slider.offsetWidth) === 1) { // Last slide
          if (currentSection < $sections.length - 1) { // Next section
            isScrolling = true;
            currentSection++;
            $sections[currentSection].scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // reset next section position
            $sections[currentSection].scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          isScrolling = true;
          snapSection('next');
        }
      } else if (event.deltaY < 0) { // Scroll up
        if (slider.scrollLeft === 0) {
          if (currentSection > 0) { // Previous section
            isScrolling = true;
            currentSection--;
            $sections[currentSection].scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          isScrolling = true;
          snapSection('prev');
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
          isScrolling = true;
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