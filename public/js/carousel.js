// let slideIndex = 0;
// let slides = document.getElementsByClassName("mySlides");
// let length = slides.length;
// slides[slideIndex].style.display = "block";
// setTimeout(showSlides, 7000)

let slideIndex = 0;
showSlides();

function showSlides() {
//   console.log(slideIndex)
//     slides[slideIndex].style.display = "none";
//     slideIndex++;
//   if (slideIndex >= length) {slideIndex = 0}
//   slides[slideIndex].style.display = "block";
//   setTimeout(showSlides, 7000)
    let i;
  let slides = document.getElementsByClassName("mySlides");
//   let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
  slides[slideIndex-1].style.display = "block";  
//   dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 10000);
}

// function hideSlides() {
//     let i;
//     let slides = document.getElementsByClassName("mySlides");
//     
//       setTimeout(showSlides);
// }

// show next Image
// wait 1 sec
// hide previous image
// wait 4 sec




