/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

var SNAP_FIX_TIMEOUT = 1000;
var $sections = document.querySelectorAll('.section');
var $sliders = document.querySelectorAll('.slider');
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var initialHash = window.location.hash;
var currentSection = 0;
var isScrolling = false;
var snapSectionTimer = null;
document.addEventListener('DOMContentLoaded', function () {
  if (!$sections.length || !$sliders.length) return;
  if (/Mobi|Movi|Android/i.test(navigator.userAgent)) {
    // Mobile devices
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
  } else {
    // Desktop devices
    var attachSlidesEvents = function attachSlidesEvents() {
      if (slidesObserver) {
        slidesObserver.disconnect();
      }
      $sections[currentSection].querySelectorAll('.slide').forEach(function (slide) {
        return slidesObserver.observe(slide);
      });
    };
    var observeSlides = function observeSlides(entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-animated');
          clearTimeout(snapSectionTimer);
          snapSectionTimer = setTimeout(function () {
            isScrolling = false;
          }, SNAP_FIX_TIMEOUT);
        }
        // if (!entry.isIntersecting) {
        //   entry.target.classList.remove('slide-animated');
        // }
      });
    };
    var observeSections = function observeSections(entries) {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio === 1) {
          attachSlidesEvents();
          clearTimeout(snapSectionTimer);
          snapSectionTimer = setTimeout(function () {
            isScrolling = false;
          }, SNAP_FIX_TIMEOUT);
        }
      });
    };

    /* fix to snap sections automatically (emulates auto-snap) */
    var snapSection = function snapSection() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (!direction) return;
      isScrolling = true;
      var slider = $sliders[currentSection];
      var pos = parseInt(slider.scrollLeft / slider.offsetWidth);
      if (direction === 'next') {
        var nextSlide = pos + 1;
        slider.scrollTo({
          left: nextSlide * slider.offsetWidth,
          behavior: 'smooth'
        });
      } else if (direction === 'prev') {
        var prevSlide = pos - 1;
        slider.scrollTo({
          left: prevSlide * slider.offsetWidth,
          behavior: 'smooth'
        });
      }
    };
    var sectionsObserver = new IntersectionObserver(observeSections, {
      threshold: 1.0
    });
    var slidesObserver = new IntersectionObserver(observeSlides, {
      threshold: 1.0
    });
    $sections.forEach(function (section) {
      return sectionsObserver.observe(section);
    });
    setInterval(function () {
      // Prevent to block scroll after a while
      if (!snapSectionTimer && isScrolling) {
        isScrolling = false;
      }
    }, SNAP_FIX_TIMEOUT * 3);
    document.addEventListener('wheel', function (event) {
      var slider = $sliders[currentSection];
      if (event.deltaX !== 0 || isScrolling) return;
      if (event.deltaY > 0) {
        // Scroll down
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth || slider.scrollWidth - (slider.scrollLeft + slider.offsetWidth) === 1) {
          // Last slide
          if (currentSection < $sections.length - 1) {
            // Next section
            isScrolling = true;
            currentSection++;
            $sections[currentSection].scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            }); // reset next section position
            $sections[currentSection].scrollIntoView({
              behavior: 'smooth'
            });
          }
        } else {
          isScrolling = true;
          snapSection('next');
        }
      } else if (event.deltaY < 0) {
        // Scroll up
        if (slider.scrollLeft === 0) {
          if (currentSection > 0) {
            // Previous section
            isScrolling = true;
            currentSection--;
            $sections[currentSection].scrollIntoView({
              behavior: 'smooth'
            });
          }
        } else {
          isScrolling = true;
          snapSection('prev');
        }
      }
    });
    var showSlide = function showSlide() {
      var $slideToShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $el;
      if ($slideToShow) {
        setTimeout(function () {
          var _$slideToShow$previou;
          $slideToShow.scrollIntoView({
            behavior: 'smooth'
          });
          isScrolling = false;
          $slideToShow.classList.add('slide-animated');
          (_$slideToShow$previou = $slideToShow.previousElementSibling) === null || _$slideToShow$previou === void 0 || (_$slideToShow$previou = _$slideToShow$previou.classList) === null || _$slideToShow$previou === void 0 || _$slideToShow$previou.add('slide-animated');
          var $section = $slideToShow.closest('.section');
          currentSection = Array.from($sections).indexOf($section);
        }, 0);
      }
    };
    if (initialHash) {
      var $slideToShow = document.querySelector(initialHash);
      showSlide($slideToShow);
    }
    window.addEventListener('popstate', function (event) {
      if (location.hash && location.hash !== "") {
        var _$slideToShow = document.querySelector(location.hash);
        showSlide(_$slideToShow);
      }
    });
    var $giftsSectionVideo = document.querySelector('#love');
    if ($giftsSectionVideo) {
      $giftsSectionVideo.setAttribute('stopped', '');
      $giftsSectionVideo.addEventListener('click', function () {
        if ($giftsSectionVideo.paused) {
          $giftsSectionVideo.play();
          if ($giftsSectionVideo.hasAttribute('stopped')) {
            $giftsSectionVideo.removeAttribute('stopped');
          }
        } else {
          $giftsSectionVideo.pause();
        }
      });
      $giftsSectionVideo.addEventListener('mouseenter', function () {
        // do nothing if video is stopped (poster)
        if ($giftsSectionVideo.hasAttribute('stopped')) return;
        // show controls only if video is playing
        $giftsSectionVideo.setAttribute("controls", "");
      });
      $giftsSectionVideo.addEventListener('mouseleave', function () {
        $giftsSectionVideo.removeAttribute("controls");
      });
    }
  }
});
/******/ })()
;