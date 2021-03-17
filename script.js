'use strict';

///////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

// Modal Window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scrolling
btnScrollTo.addEventListener('click', function() {
  section1.scrollIntoView({behavior: 'smooth'});
});

// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

// Tabbed components
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  const id = clicked.dataset.tab;

  // Guard clause
  if (!clicked) return;

  // Remove
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Add
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${id}`).classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky Navigation
// const initialCords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCords.top) {
//     nav.classList.add('sticky')
//   } else {
//     nav.classList.remove('sticky');
//   }

// });

// Sticky navigation : Intersection Objserver API
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section1);

const stickyNav = function(entries) {
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: [0],
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


// Show Sections
const sections = document.querySelectorAll('.section');

const showSection = function(entries, observer) {
  const [entry] = entries;

  // Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('.section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold: 0.15, // 15 percent visible
  rootMargin: '200px' // 200px before the images are loaded should start loading.
});

sections.forEach(function(section) {
  sectionObserver.observe(section);
  // section.classList.add('.section--hidden');
})

// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(loadImg, {
  root: null, // entire viewport
  threshold: 0
});

imgTargets.forEach(img => imageObserver.observe(img));


// Slider
const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function() {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  const goToSlide = function(slide) {
    slides.forEach(
      (s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  };

  const nextSlide = function() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const prevSlide = function() {
    if (curSlide === 0) {
      curSlide = maxSlide -1
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const init = function() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }

  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  })
};

slider();
