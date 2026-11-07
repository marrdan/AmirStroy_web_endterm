// Общее для всех страниц: счётчик корзины и jQuery-эффекты (кнопка «наверх», плавная прокрутка).

updateCartBadge();

$(function () {
  const topButton = $('<button type="button" class="to-top" aria-label="Back to top">&#8593;</button>');
  topButton.hide();
  $("body").append(topButton);

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 400) {
      topButton.stop(true, true).fadeIn(200);
    } else {
      topButton.stop(true, true).fadeOut(200);
    }
  });

  topButton.on("click", function () {
    $("html, body").stop(true).animate({ scrollTop: 0 }, 500);
  });

  
  $('a[href^="#"]').on("click", function (event) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();
      $("html, body").stop(true).animate({ scrollTop: target.offset().top - 90 }, 500);
    }
  });
});
