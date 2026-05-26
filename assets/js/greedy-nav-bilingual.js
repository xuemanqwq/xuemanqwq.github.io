/*
 * Bilingual masthead nav: mobile = hamburger + vertical menu; desktop = greedy overflow.
 * Mobile Edge: use .is-open class (not :not(.hidden)) and innerWidth fallback.
 */
(function ($) {
  "use strict";

  var MOBILE_MAX = 924;
  var MOBILE_MQ = window.matchMedia("(max-width: " + MOBILE_MAX + "px)");
  var $nav = $("#site-nav");
  var $btn = $("#site-nav > button").first();
  var $hlinks = $("#site-nav .hidden-links");
  var breaks = [];

  function isMobile() {
    if (window.matchMedia) {
      return window.matchMedia("(max-width: " + MOBILE_MAX + "px)").matches;
    }
    return window.innerWidth <= MOBILE_MAX;
  }

  function getVisibleLinks() {
    return $("#site-nav .visible-links");
  }

  function isLangVisibleItem($li) {
    var isEn = document.documentElement.classList.contains("site-lang-en");
    if ($li.hasClass("masthead__nav-item--en")) return isEn;
    if ($li.hasClass("masthead__nav-item--zh")) return !isEn;
    return true;
  }

  function langItems($container) {
    return $container.children("li").filter(function () {
      return isLangVisibleItem($(this));
    });
  }

  function closeMenu() {
    $hlinks.removeClass("is-open").addClass("hidden");
    $btn.removeClass("close");
    $btn.attr("aria-expanded", "false");
  }

  function openMenu() {
    $hlinks.removeClass("hidden").addClass("is-open");
    $btn.addClass("close");
    $btn.attr("aria-expanded", "true");
  }

  function restoreAllItems() {
    var $vlinks = getVisibleLinks();
    $hlinks.children().appendTo($vlinks);
    breaks = [];
    closeMenu();
  }

  function layoutMobileNav() {
    restoreAllItems();
    var $vlinks = getVisibleLinks();
    var $items = langItems($vlinks);
    if ($items.length) {
      $items.appendTo($hlinks);
    }
    $nav.addClass("greedy-nav--mobile");
    $btn.removeClass("hidden");
    closeMenu();
  }

  function layoutDesktopNav() {
    restoreAllItems();
    $nav.removeClass("greedy-nav--mobile");
    var $vlinks = getVisibleLinks();
    var availableSpace = $nav.width() - $btn.width() - 30;

    function overflow() {
      return $vlinks.width() > availableSpace;
    }

    while (overflow()) {
      var $items = langItems($vlinks);
      if (!$items.length) break;
      breaks.push($vlinks.width());
      $items.last().prependTo($hlinks);
      $btn.removeClass("hidden");
    }

    if (breaks.length < 1) {
      $btn.addClass("hidden");
      closeMenu();
    }

    $btn.attr("count", breaks.length);
  }

  function syncNavLayout() {
    if (isMobile()) {
      layoutMobileNav();
    } else {
      layoutDesktopNav();
    }
  }

  function toggleMenu() {
    if ($hlinks.hasClass("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  window.greedyNavRestore = restoreAllItems;
  window.greedyNavUpdate = syncNavLayout;
  window.updateNav = syncNavLayout;

  $btn.attr("type", "button");
  $btn.attr("aria-label", "Toggle navigation");
  $btn.attr("aria-expanded", "false");

  $btn.off("click.greedyNav").on("click.greedyNav", function (e) {
    e.preventDefault();
    if (!isMobile() && breaks.length < 1) return;
    toggleMenu();
  });

  $(window).off("resize.greedyNav orientationchange.greedyNav").on("resize.greedyNav orientationchange.greedyNav", function () {
    syncNavLayout();
  });

  if (MOBILE_MQ.addEventListener) {
    MOBILE_MQ.addEventListener("change", syncNavLayout);
  } else if (MOBILE_MQ.addListener) {
    MOBILE_MQ.addListener(syncNavLayout);
  }

  $(document).on("click.greedyNav", function (e) {
    if ($(e.target).closest("#site-nav").length) return;
    if (isMobile() || breaks.length > 0) {
      closeMenu();
    }
  });

  $(function () {
    syncNavLayout();
    /* Edge 首次渲染后尺寸可能不准，再算一次 */
    setTimeout(syncNavLayout, 100);
    setTimeout(syncNavLayout, 500);
  });
})(jQuery);
