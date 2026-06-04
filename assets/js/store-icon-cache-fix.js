/* Jooking Store visible fix */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('img[src="/assets/img/categories/store.svg"]').forEach(function (img) {
    img.src = "/assets/img/categories/store.svg?v=2";
  });
});
