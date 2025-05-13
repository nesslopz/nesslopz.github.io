/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

var SAFARI_SNAP_FIX_TIMEOUT = 200;
var $sections = document.querySelectorAll('.section');
var $sliders = document.querySelectorAll('.slider');
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var initialHash = window.location.hash;
var currentSection = 0;
var isScrolling = false;
var scrollWheel = 0;
document.addEventListener('DOMContentLoaded', function () {
  if (/Mobi|Movi|Android/i.test(navigator.userAgent)) {
    // Mobile devices
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
    var observeSections = function observeSections(entries) {
      entries.forEach(function (entry) {
        if (entry.intersectionRatio === 1) {
          setTimeout(function () {
            scrollWheel = 0;
            isScrolling = false;
          }, 1000);
        }
      });
    };

    /* Safari fix to snap sections automatically (emulates auto-snap) */
    var snapSection = function snapSection() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (!direction) return;
      var slider = $sliders[currentSection];
      var pos = parseInt(slider.scrollLeft / slider.offsetWidth);
      var intersectionNextSlide = slider.scrollLeft % slider.offsetWidth / slider.offsetWidth;
      if (direction === 'next' && intersectionNextSlide >= 0.1) {
        var nextSlide = pos + 1;
        slider.scrollTo({
          left: nextSlide * slider.offsetWidth,
          behavior: 'smooth'
        });
      } else if (direction === 'prev' && intersectionNextSlide <= 0.8) {
        var prevSlide = pos;
        slider.scrollTo({
          left: prevSlide * slider.offsetWidth,
          behavior: 'smooth'
        });
      } else {
        slider.scrollTo({
          left: pos * slider.offsetWidth,
          behavior: 'smooth'
        });
      }
      isScrolling = false;
    };
    var sectionsObserver = new IntersectionObserver(observeSections, {
      threshold: 1.0
    });
    $sections.forEach(function (section) {
      return sectionsObserver.observe(section);
    });
    var snapSectionTimer = null;
    document.addEventListener('wheel', function (event) {
      var slider = $sliders[currentSection];
      if (snapSectionTimer) clearTimeout(snapSectionTimer);
      if (event.deltaX !== 0 || isScrolling) return;
      if (event.deltaY > 0) {
        // Scroll down
        scrollWheel++;
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth || slider.scrollWidth - (slider.scrollLeft + slider.offsetWidth) === 1) {
          // Last slide
          if (currentSection < $sections.length - 1) {
            // Next section
            isScrolling = true;
            currentSection++;
            $sections[currentSection].scrollIntoView({
              behavior: 'smooth'
            });
          }
        } else {
          slider.scrollBy({
            left: event.deltaY,
            behavior: 'smooth'
          });
          if (isSafari) {
            // Force snap behavior in Safari
            snapSectionTimer = setTimeout(function () {
              isScrolling = true;
              snapSection('next');
            }, SAFARI_SNAP_FIX_TIMEOUT);
          }
        }
      } else if (event.deltaY < 0) {
        // Scroll up
        scrollWheel--;
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
          slider.scrollBy({
            left: event.deltaY,
            behavior: 'smooth'
          });
          if (isSafari) {
            // Force snap behavior in Safari
            snapSectionTimer = setTimeout(function () {
              isScrolling = true;
              snapSection('prev');
            }, SAFARI_SNAP_FIX_TIMEOUT);
          }
        }
      }
      if (!isSafari) {
        if (scrollWheel < -1 || scrollWheel > 1) {
          isScrolling = true;
          setTimeout(function () {
            scrollWheel = 0;
            isScrolling = false;
          }, 1000);
        }
      }

      /* Enable animations here */
    });
    if (initialHash) {
      var $slideToShow = document.querySelector(initialHash);
      if ($slideToShow) {
        $slideToShow.scrollIntoView({
          behavior: 'smooth'
        });
        scrollWheel = 0;
        isScrolling = false;
      }
    }
    window.addEventListener('popstate', function (event) {
      if (location.hash && location.hash !== "") {
        var _$slideToShow = document.querySelector(location.hash);
        if (_$slideToShow) {
          setTimeout(function () {
            _$slideToShow.scrollIntoView({
              behavior: 'smooth'
            });
            scrollWheel = 0;
            isScrolling = false;
          }, 0);
        }
      }
    });
    var $giftsSecionVideo = document.querySelector('#love');
    if ($giftsSecionVideo) {
      $giftsSecionVideo.addEventListener('click', function () {
        if ($giftsSecionVideo.paused) {
          $giftsSecionVideo.play();
        } else {
          $giftsSecionVideo.pause();
        }
      });
    }
  }
});
/******/ })()
;