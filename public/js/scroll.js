const backToTop = document.getElementById('back-to-top')

document.body.addEventListener('scroll', () => {
  console.log('scroll')
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTop.style.opacity = '1';
  } else {
    backToTop.style.opacity = '0';
  }
})