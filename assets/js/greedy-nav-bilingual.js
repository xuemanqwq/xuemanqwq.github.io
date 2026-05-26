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

  function updateNav() {
    var $vlinks = getVisibleLinks();
    var availableSpace = $btn.hasClass("hidden")
      ? $nav.width()
      : $nav.width() - $btn.width() - 30;

    if ($vlinks.width() > availableSpace) {
      breaks.push($vlinks.width());
      $vlinks.children(":visible").last().prependTo($hlinks);

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

  $(function () {
    restoreGreedyNav();
    updateNav();
  });
})(jQuery);
