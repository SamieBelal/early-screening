(function () {
  var KEY = "early-screening-checklist";
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  document.querySelectorAll(".check").forEach(function (btn) {
    var k = btn.dataset.key;
    if (saved[k]) btn.setAttribute("aria-pressed", "true");
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      saved[k] = on;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    });
  });

  // Language menu
  var langBtn = document.getElementById("lang-btn");
  var menu = document.getElementById("lang-menu");
  var setOpen = function (open) {
    menu.hidden = !open;
    langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var current = menu.querySelector('[aria-current="page"]') || menu.querySelector("a");
      current.focus();
    }
  };
  langBtn.addEventListener("click", function () { setOpen(menu.hidden); });
  document.addEventListener("click", function (e) {
    if (!menu.hidden && !menu.contains(e.target) && !langBtn.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) { setOpen(false); langBtn.focus(); }
  });

  // On first visit this session, cycle the button through "Language" in every
  // language once, so a parent can spot their own, then settle on this page's word.
  var word = document.getElementById("lang-word");
  var words = JSON.parse(langBtn.dataset.words);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem("lang-cycle-seen") === "1"; } catch (e) {}
  if (!reduce && !seen) {
    try { sessionStorage.setItem("lang-cycle-seen", "1"); } catch (e) {}
    var i = 0;
    var step = function () {
      if (i >= words.length || !menu.hidden) {
        var last = words[words.length - 1];
        word.textContent = last.w; word.lang = last.lang; word.dir = last.dir;
        word.classList.remove("fading");
        return;
      }
      word.classList.add("fading");
      setTimeout(function () {
        var w = words[i++];
        word.textContent = w.w; word.lang = w.lang; word.dir = w.dir;
        word.classList.remove("fading");
        setTimeout(step, 900);
      }, 180);
    };
    setTimeout(step, 1200);
  }

  var shareBtn = document.getElementById("share-btn");
  var status = document.getElementById("share-status");
  var show = function (msg) {
    status.textContent = msg;
    clearTimeout(show.t);
    show.t = setTimeout(function () { status.textContent = ""; }, 4000);
  };
  shareBtn.addEventListener("click", function () {
    var data = {
      title: document.title,
      text: shareBtn.dataset.shareText,
      url: location.href
    };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(function () {
        show(shareBtn.dataset.copied);
      }, function () {
        show(shareBtn.dataset.copy + location.href);
      });
    } else {
      show(shareBtn.dataset.copy + location.href);
    }
  });
})();
