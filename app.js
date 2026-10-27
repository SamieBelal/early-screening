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
