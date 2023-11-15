document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('slider')) {
    var splide = new Splide('#slider', {
      type: 'loop',
      perPage: 2,
      focus: 'center',
      gap: 20,
      with: '100vh',
      fixedWidth: 1100,
      arrows: false,
      pagination: false,
      autoplay: true,
      interval: 5000,
    });
    splide.mount();
  }
});
