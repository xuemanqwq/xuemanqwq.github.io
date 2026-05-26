/*
 * Override greedy nav for bilingual single-list masthead.
 * Loaded after main.min.js; replaces global updateNav().
 */
(function ($) {
  var $nav = $("#site-nav");
  var $btn = $("#site-nav button");
  var $hlinks = $("#site-nav .hidden-links");
  var breaks = [];

  function getVisibleLinks() {
    return $("#site-nav .visible-links");
  }

  function restoreGreedyNav() {
    var $vlinks = getVisibleLinks();
    $hlinks.children().appendTo($vlinks);
    breaks = [];
    $btn.addClass("hidden");
    $hlinks.addClass("hidden");
    $btn.removeClass("close");
  }

  function isLangVisibleItem($li) {
    var isEn = document.documentElement.classList.contains("site-lang-en");
    if ($li.hasClass("masthead__nav-item--en")) return isEn;
    if ($li.hasClass("masthead__nav-item--zh")) return !isEn;
    return true;
  }

  function visibleNavItems($vlinks) {
    return $vlinks.children("li").filter(function () {
      var $li = $(this);
      return isLangVisibleItem($li) && $li.is(":visible");
    });
  }

  function updateNav() {
    var $vlinks = getVisibleLinks();
    var $items = visibleNavItems($vlinks);
    var availableSpace = $btn.hasClass("hidden")
      ? $nav.width()
      : $nav.width() - $btn.width() - 30;

    if ($vlinks.width() > availableSpace && $items.length > 0) {
      breaks.push($vlinks.width());
      $items.last().prependTo($hlinks);

      if ($btn.hasClass("hidden")) {
        $btn.removeClass("hidden");
      }
    } else {
      if (breaks.length && availableSpace > breaks[breaks.length - 1]) {
        $hlinks.children().first().appendTo($vlinks);
        breaks.pop();
      }

      if (breaks.length < 1) {
        $btn.addClass("hidden");
        $hlinks.addClass("hidden");
      }
    }

    $btn.attr("count", breaks.length);

    if ($vlinks.width() > availableSpace) {
      updateNav();
    }
  }

  window.greedyNavRestore = restoreGreedyNav;
  window.updateNav = updateNav;

  $btn.off("click.greedyNav").on("click.greedyNav", function () {
    $hlinks.toggleClass("hidden");
    $(this).toggleClass("close");
  });

  $(window).off("resize.greedyNav").on("resize.greedyNav", updateNav);

  $(function () {
    restoreGreedyNav();
    updateNav();
  });
})(jQuery);
