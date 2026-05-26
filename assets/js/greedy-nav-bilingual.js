/*
 * Bilingual masthead nav: mobile = hamburger + vertical menu; desktop = greedy overflow.
 */
(function ($) {
  "use strict";

  var MOBILE_MQ = window.matchMedia("(max-width: 924px)");
  var $nav = $("#site-nav");
  var $btn = $("#site-nav > button").first();
  var $hlinks = $("#site-nav .hidden-links");
  var breaks = [];

  function isMobile() {
    return MOBILE_MQ.matches;
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
    $hlinks.addClass("hidden");
    $btn.removeClass("close");
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
    $btn.removeClass("hidden");
    closeMenu();
  }

  function layoutDesktopNav() {
    restoreAllItems();
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

  window.greedyNavRestore = restoreAllItems;
  window.greedyNavUpdate = syncNavLayout;
  window.updateNav = syncNavLayout;

  $btn.attr("type", "button");
  $btn.attr("aria-label", "Toggle navigation");
  $btn.attr("aria-expanded", "false");

  $btn.off("click").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isMobile() && breaks.length < 1) return;
    var open = $hlinks.hasClass("hidden");
    $hlinks.toggleClass("hidden");
    $btn.toggleClass("close");
    $btn.attr("aria-expanded", open ? "true" : "false");
  });

  $(window).off("resize.greedyNav").on("resize.greedyNav", syncNavLayout);

  if (MOBILE_MQ.addEventListener) {
    MOBILE_MQ.addEventListener("change", syncNavLayout);
  }

  $(document).on("click.greedyNav", function (e) {
    if ($(e.target).closest("#site-nav").length) return;
    if (isMobile() || breaks.length > 0) {
      closeMenu();
      $btn.attr("aria-expanded", "false");
    }
  });

  $(function () {
    syncNavLayout();
  });
})(jQuery);
