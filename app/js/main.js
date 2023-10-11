
const 
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	nav = document.querySelector('.header__nav'),
	burger = document.querySelector('.header__burger'),
	header = document.querySelector('.header');



function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveID = (typeof arg == 'object') ? (arg['saveID']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				if(popup.classList.contains('popup')) {

					body.classList.remove('_popup-active');
					html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
					body.classList.add('_popup-active');

					if (saveID) history.pushState('', "", id);

					setTimeout(() => {
						if (!initStart) {
							popup.classList.add('_active');
							function openFunc() {
								popupCheck = true;
								popup.removeEventListener('transitionend', openFunc);
							}
							popup.addEventListener('transitionend', openFunc)
						} else {
							popup.classList.add('_transition-none');
							popup.classList.add('_active');
							popupCheck = true;
						}

					}, 0)
				}

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveID) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.removeEventListener('transitionend', closeFunc)
				}

				popup.addEventListener('transitionend', closeFunc)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			body.addEventListener('keyup', function (event) {

				if(event.code == 27 && document.querySelector('.popup._active')) {
					close(document.querySelector('.popup._active'));
				}

			});

			if (saveID) {
				let url = new URL(window.location), url2 = new URL(window.location);

				url2.search = '';
				url.hash = url.hash.split('?')[0];
				
				if (url.hash == url2.hash && url.hash.indexOf('#') == 0) {
					open(url.hash, true);
				} else if(url.hash.length < url2.hash.length && url.hash.indexOf('#') == 0) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup();

popup.init()

// =-=-=-=-=-=-=-=-=-=- <image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-

const imageAspectRatio = document.querySelectorAll('.image-aspect-ratio, figure');
imageAspectRatio.forEach(imageAspectRatio => {
	const img = imageAspectRatio.querySelector('img'), style = getComputedStyle(imageAspectRatio);
	if(img) {
		if(img.getAttribute('width') && img.getAttribute('height') && style.position == "relative") {
			imageAspectRatio.style.setProperty('--padding-aspect-ratio', Number(img.getAttribute('height')) / Number(img.getAttribute('width')) * 100 + '%');
			imageAspectRatio.style.setProperty('--aspect-ratio', "1/" + Number(img.getAttribute('height')) / Number(img.getAttribute('width')));
		}
		
	}
	
})

// =-=-=-=-=-=-=-=-=-=- </image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

let gallery3Slider, galleryPopupSlider;

if(document.querySelector('.gallery-3__slider') && document.querySelector('.gallery-popup__slider')) {

	gallery3Slider = new Splide('.gallery-3__slider', {

		type: "loop",
		autoWidth: true,
		gap: 20,
		pagination: false,
		speed: 700,
		easing: "ease",
		updateOnMove: true,
		isNavigation: true,
		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',

	});

	galleryPopupSlider = new Splide('.gallery-popup__slider', {

		type: "loop",
		focus: "center",
		autoWidth: true,
		gap: 20,
		pagination: false,
		arrows: false,
		speed: 700,
		easing: "ease",
		updateOnMove: true,
		isNavigation: true,
		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',
		
	});

	gallery3Slider.root.querySelectorAll('.gallery-3__image').forEach((image, index) => {
		image.setAttribute('data-index', index);
	})

	const galleryPopupLength = galleryPopupSlider.root.closest('.popup').querySelector('.gallery-popup__length span');
	galleryPopupSlider.on('mounted moved', function () {
		if(html.getAttribute('dir') == 'rtl') {
			galleryPopupLength.textContent = `${galleryPopupSlider.length}/${galleryPopupSlider.index+1}`;
		} else {
			galleryPopupLength.textContent = galleryPopupSlider.index+1 + '/' + galleryPopupSlider.length;
		}
		
	})

	let sliderPagesLength = gallery3Slider.root.querySelector('.slider-pages-length');

	if(gallery3Slider) {
		gallery3Slider.on('mounted moved', function (event) {
			if(html.getAttribute('dir') == 'rtl') {
				sliderPagesLength.textContent = `${gallery3Slider.length}/${gallery3Slider.index+1}`
			} else {
				sliderPagesLength.textContent = `${gallery3Slider.index+1}/${gallery3Slider.length}`
			}
		})
	}

	gallery3Slider.sync(galleryPopupSlider);
	gallery3Slider.mount();
	galleryPopupSlider.mount();

	galleryPopupSlider.go(0)

}


body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger')) {
		menu.forEach(element => {
			element.classList.toggle('_mob-menu-active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-nav> -=-=-=-=-=-=-=-=-=-=-=-=


	const headerNavButton = $('.header__nav--list > li > button');
	
	if(headerNavButton) {
		if(document.querySelector('.header__nav--list > li > button.is-active')) document.querySelector('.header__nav--list > li > button.is-active').classList.remove('is-active');
		headerNavButton.classList.add('is-active');
		nav.classList.add('menu-level-1');
		nav.scrollTo({left:0,top:0})
	} else if(!$('.header__nav--list > li')) {
		if(document.querySelector('.header__nav--list > li > button.is-active')) {
			nav.classList.remove('menu-level-1');
			document.querySelector('.header__nav--list > li > button.is-active').classList.remove('is-active');
		}
	} else if($('.header__nav--list > li > a')) {
		if(document.querySelector('.header__nav--list > li > button.is-active')) {
			nav.classList.remove('menu-level-1');
			document.querySelector('.header__nav--list > li > button.is-active').classList.remove('is-active');
		}
	}
	
	const headerNavSubLink = $(".header__nav--list > li > div > ul > li > ul > li > a")
	if(headerNavSubLink) {

		if(headerNavSubLink.parentElement.querySelector('ul')) {
			if(!headerNavSubLink.classList.contains('is-active')) {
				if(document.querySelector(".header__nav--list > li > div > ul > li > ul > li > a.is-active")) document.querySelector(".header__nav--list > li > div > ul > li > ul > li > a.is-active").classList.remove('is-active');
				
				nav.classList.add('menu-level-2');
				document.querySelector(".header__nav--list > li > div").scroll({left: 0, top: 0})
				event.preventDefault();
				headerNavSubLink.classList.add('is-active');
			}
		}
	
	} else if(document.querySelector(".header__nav--list > li > div > ul > li > ul > li > a.is-active") && !$('.header__nav--list > li > div > ul > li > ul > li')) {

		document.querySelector(".header__nav--list > li > div > ul > li > ul > li > a.is-active").classList.remove('is-active');
		nav.classList.remove('menu-level-2');

	}


	const headerNavBack = $('.header__nav--list > li > div > button');
	if(headerNavBack) {
		const button = headerNavBack.closest('.header__nav--list > li').querySelector('.header__nav--list > li > button.is-active');
		button.classList.remove('is-active')
		nav.classList.remove('menu-level-1');
	}

	const headerNavBack2 = $('.header__nav--list > li > div > ul > li > ul > li > div > button');
	if(headerNavBack2) {
		const button = headerNavBack2.closest('.header__nav--list > li > div > ul > li > ul > li').querySelector('.header__nav--list > li > div > ul > li > ul > li > a.is-active');
		button.classList.remove('is-active');
		nav.classList.remove('menu-level-2');
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-nav> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <header-lang> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerLangTarget = $(".header__lang--target")
	if(headerLangTarget) {
	
		headerLangTarget.classList.toggle('is-active');
	
	} else if(!$('.header__lang') && document.querySelector('.header__lang--target.is-active')) {
		document.querySelector('.header__lang--target.is-active').classList.remove('is-active')
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-lang> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <footer-nav-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const footerNavButton = $(".footer__nav > ul > li > button");
	if(footerNavButton) {
	
		footerNavButton.classList.toggle('is-active');
	
	} else if(!$(".footer__nav")) {
		if(document.querySelector('.footer__nav > ul > li > button.is-active')) {
			document.querySelector('.footer__nav > ul > li > button.is-active').classList.remove('is-active');
		}
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </footer-nav-drop-down> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=
	
	let scrollTo = $('.scroll-to');
	
	if(scrollTo) {
		event.preventDefault();
		let section;
	
		section = scrollTo.getAttribute('href') ? document.querySelector(scrollTo.getAttribute('href')) : false;
	
		menu.forEach(elem => {
			elem.classList.remove('_mob-menu-active')
		})
	
		if(section) {
			section.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		} else {
			body.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <services> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const servicesLoadMore = $(".services__load-more")
	if(servicesLoadMore) {
	
		const list = servicesLoadMore.closest('section').querySelector('.services__list');
		list.classList.remove('hide-cards');

		list.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
	
	}
	
	const servicesSeeMore = $(".services__see-more")
	if(servicesSeeMore) {
	
		const list = servicesSeeMore.closest('section').querySelector('.services__list');
		list.classList.add('is-active');
		servicesSeeMore.remove();
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </services> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <more-info> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const tariffsCardLearnMore = $(".tariffs__card--learn-more")
	if(tariffsCardLearnMore) {
	
		const card = tariffsCardLearnMore.closest('.tariffs__card');
		card.classList.toggle('is-more');

		if(card.classList.contains('is-more')) {
			tariffsCardLearnMore.querySelector('span').textContent = tariffsCardLearnMore.dataset.hideText;
		} else {
			tariffsCardLearnMore.querySelector('span').textContent = tariffsCardLearnMore.dataset.moreText;
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </more-info> -=-=-=-=-=-=-=-=-=-=-=-=


	// =-=-=-=-=-=-=-=-=-=-=-=- <cources-nav> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const coursesNavBtn = $(".courses__nav--btn")
	if(coursesNavBtn) {
	
		event.preventDefault();
		if(!coursesNavBtn.classList.contains('is-current')) {
			
			const activeBlock = coursesNavBtn.closest('section').querySelector('.courses__block.is-active'),
			targetBlock = document.querySelector(coursesNavBtn.getAttribute('href'));

			if(targetBlock && activeBlock) {

				coursesNavBtn.closest('.courses__nav').querySelector('.is-active').classList.remove('is-active');
				coursesNavBtn.classList.add('is-active');
				
				activeBlock.classList.add('fade-out');
				setTimeout(() => {
					if(targetBlock.querySelector('.desplode-circle')) {
						targetBlock.querySelectorAll('.desplode-circle').forEach(circle => {
							circle.classList.remove('desplode-circle');
						})
					}
					activeBlock.classList.remove('is-active');
					targetBlock.classList.remove('fade-out');
					targetBlock.classList.add('is-active');
					targetBlock.classList.add('fade-in');
					if(document.querySelector('.btn-wrapper')) {
						document.querySelectorAll('.btn-wrapper').forEach(btnWrapper => {
							btnWrapper.style.setProperty('--size', btnWrapper.offsetWidth * 2 + 'px');
						})
					}
				},300)
			}
		}
		
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </cources-nav> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <faq> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const faqQuestion = $(".faq__question")
	if(faqQuestion) {
	
		if(faqQuestion.classList.contains('is-active')) {

			faqQuestion.classList.remove('is-active');

		} else {
			if(faqQuestion.closest('.faq__list').querySelector('.faq__question.is-active')) {
				faqQuestion.closest('.faq__list').querySelector('.faq__question.is-active').classList.remove('is-active');
			}

			faqQuestion.classList.add('is-active');
		}
		
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </faq> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <table-of-contents> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const tableOfContentsLink = $(".text-section__aside a");
	if(tableOfContentsLink) {
	
		event.preventDefault();
		const section = document.querySelector(tableOfContentsLink.getAttribute('href'));
		section.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

		history.pushState('', "", tableOfContentsLink.getAttribute('href'));
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </table-of-contents> -=-=-=-=-=-=-=-=-=-=-=-=

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-


// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let windowSize = 0;

function resize() {

	if(document.querySelector('.btn-wrapper')) {
		document.querySelectorAll('.btn-wrapper').forEach(btnWrapper => {
			btnWrapper.style.setProperty('--size', btnWrapper.offsetWidth * 2 + 'px');
		})
	}

	html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
	if(windowSize != window.innerWidth) {
		html.style.setProperty("--svh", window.innerHeight * 0.01 + "px");
	}
	
	windowSize = window.innerWidth;
	
}

resize();

window.addEventListener('resize', resize)

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

if(document.querySelector('.hero__slider')) {

	const slider = new Splide('.hero__slider', {

		type: "loop",
		drag: 'free',
  		focus: 'center',
		perPage: 1,
		gap: 10,
		autoScroll: {
			speed: 0.5,
		},

		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',
		mediaQuery: "min",

		arrows: false,
		pagination: false,

		breakpoints: {
			550: {
				perPage: 3,
			},
			992: {
				perPage: 4,
			},
			1500: {
				perPage: 5,
			}
		}

	});

	slider.mount(window.splide.Extensions);

}

if(document.querySelector('.reviews__slider')) {

	const slider = new Splide('.reviews__slider', {

		type: "loop",
		perPage: 1,
		perMove: 1,
		gap: 21,
		easing: "ease",
		pagination: false,
		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',

		mediaQuery: "min",

		breakpoints: {
			768: {
				perPage: 2,
			},

			992: {
				perPage: 3,
			},
		}

	});

	let sliderPagesLength = slider.root.querySelector('.slider-pages-length');

	if(sliderPagesLength) {
		slider.on('mounted moved', function (event) {
			if(html.getAttribute('dir') == "rtl") {
				sliderPagesLength.textContent = `${slider.length}/${slider.index+1}`
			} else {
				sliderPagesLength.textContent = `${slider.index+1}/${slider.length}`
			}
		})
	}

	slider.mount();

}

if(document.querySelector('.gallery__slider') && document.querySelector('.gallery__pagination')) {

	const pagination = new Splide('.gallery__pagination', {

		direction: 'ttb',
		
		height   : '100%',
		gap: 8,
		//perPage: "auto",
		autoHeight: true,
		arrows: false,
		pagination: false,
		updateOnMove: true,
		isNavigation: true,
		rewind: true,

	});

	pagination.on('mounted moved', function () {
		if(pagination.index == 0) {
			pagination.root.classList.remove('is-end');
			pagination.root.classList.add('is-start');
		} else if(pagination.index == pagination.length-1) {
			pagination.root.classList.remove('is-start');
			pagination.root.classList.add('is-end');
		} else {
			pagination.root.classList.remove('is-end');
			pagination.root.classList.remove('is-start');
		}
	})

	

	const slider = new Splide('.gallery__slider', {

		direction: 'ttb',
		height: '447px',
		gap: 21,
		speed: 700,
		easing: "ease",
		rewind: true,
		arrows: true,
		pagination: false,
		perPage: 1,

		breakpoints: {
			992: {
				direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',
				height: "auto",
				gap: 16,
			},

			550: {
				// params
			}
		}

	});

	let sliderPagesLength = slider.root.querySelector('.slider-pages-length');

	if(sliderPagesLength) {
		slider.on('mounted moved', function (event) {
			if(html.getAttribute('dir') == "rtl") {
				sliderPagesLength.textContent = `${slider.length}/${slider.index+1}`
			} else {
				sliderPagesLength.textContent = `${slider.index+1}/${slider.length}`
			}
		})
	}

	slider.sync( pagination );
	slider.mount();
	pagination.mount();

}

if(document.querySelector('.our-partners__slider')) {

	const slider = new Splide('.our-partners__slider', {

		type: "loop",
		perPage: 1,
		gap: 20,
		pagination: false,
		arrows: false,
		mediaQuery: "min",
		
		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',
		autoScroll: {
			speed: 0.5,
		},

		breakpoints: {

			768: {
				perPage: 4,
			},

			550: {
				perPage: 2
			},
		}

	});

	slider.mount(window.splide.Extensions);

}

if(document.querySelector('.about-us__slider')) {

	const slider = new Splide('.about-us__slider', {

		type: "loop",
		autoWidth: true,
		pagination: false,
		speed: 700,
		easing: "ease",
		gap: 20,
		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',

	});

	let sliderPagesLength = slider.root.querySelector('.slider-pages-length');

	if(sliderPagesLength) {
		slider.on('mounted moved', function (event) {
			if(html.getAttribute('dir') == "rtl") {
				sliderPagesLength.textContent = `${slider.length}/${slider.index+1}`
			} else {
				sliderPagesLength.textContent = `${slider.index+1}/${slider.length}`
			}
		})
	}

	slider.mount();

}

if(document.querySelector('.portfolio__slider')) {

	const slider = new Splide('.portfolio__slider', {

		type: "loop",
		autoWidth: true,
		pagination: false,
		speed: 700,
		easing: "ease",
		gap: 20,
		direction: html.getAttribute('dir') == "rtl" ? 'rtl' : 'ltr',

	});

	let sliderPagesLength = slider.root.querySelector('.slider-pages-length');

	if(slider) {
		slider.on('mounted moved', function (event) {
			if(html.getAttribute('dir') == "rtl") {
				sliderPagesLength.textContent = `${slider.length}/${slider.index+1}`
			} else {
				sliderPagesLength.textContent = `${slider.index+1}/${slider.length}`
			}
		})
	}

	slider.mount();

}

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <get-coords> -=-=-=-=-=-=-=-=-=-=-=-=

function getCoords(elem) {
	let box = elem.getBoundingClientRect();

	return {
	top: box.top + window.pageYOffset,
	right: box.right + window.pageXOffset,
	bottom: box.bottom + window.pageYOffset,
	left: box.left + window.pageXOffset
	};
}

// =-=-=-=-=-=-=-=-=-=-=-=- </get-coords> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=- <Get-device-type> -=-=-=-=-=-=-=-=-=-=-

const getDeviceType = () => {

	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}

	if (
		/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
		ua
		)
	) {
		return "mobile";
	}
	return "desktop";

};

// =-=-=-=-=-=-=-=-=-=- </Get-device-type> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=-=-=- <btn-hover> -=-=-=-=-=-=-=-=-=-=-=-=

function btnPointerEnter(event) {
	if(getDeviceType() == "desktop") {
	
		var parentOffset = getCoords(event.target);
	
		var relX = event.pageX - parentOffset.left;
		var relY = event.pageY - parentOffset.top;

		event.target.nextElementSibling.style.setProperty('left', relX + 'px');
		event.target.nextElementSibling.style.setProperty('top', relY + 'px');
		
		event.target.nextElementSibling.classList.remove("desplode-circle");
		event.target.nextElementSibling.classList.add("explode-circle");

	}
}

function btnPointerLeave(event) {
	if(getDeviceType() == "desktop") {
	
		var parentOffset = getCoords(event.target);
	
		var relX = event.pageX - parentOffset.left;
		var relY = event.pageY - parentOffset.top;
		
		event.target.nextElementSibling.style.setProperty('left', relX + 'px');
		event.target.nextElementSibling.style.setProperty('top', relY + 'px');

		event.target.nextElementSibling.classList.add("desplode-circle");
		event.target.nextElementSibling.classList.remove("explode-circle");

	}
}

function btnHover() {
	document.querySelectorAll('.btn:not([aria-disabled="true"])').forEach(btn => {

		btn.removeEventListener('pointerenter', btnPointerEnter)
		btn.addEventListener('pointerenter', btnPointerEnter)
	
		btn.removeEventListener('pointerleave', btnPointerLeave)
		btn.addEventListener('pointerleave', btnPointerLeave)
	})
}

btnHover()

let headerNavBackgroundTimeout;

document.querySelectorAll('.header__nav--list > li > button').forEach(btn => {

	btn.addEventListener('pointerenter', function (event) {
		if(getDeviceType() == "desktop") {
			btn.classList.add('is-active');
		}
	})

	btn.parentElement.addEventListener('pointerleave', function (event) {
		if(getDeviceType() == "desktop") {
			btn.classList.remove('is-active');
		}
	})

})

// =-=-=-=-=-=-=-=-=-=-=-=- </btn-hover> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <cookies> -=-=-=-=-=-=-=-=-=-=-=-=

const cookiesBtn = document.querySelector('.cookies__btn'),
	  cookies = document.querySelector('.cookies'),
	  cookiesClose = document.querySelector('.cookies__close');

if(cookiesBtn && cookiesClose && !localStorage.getItem('fun-factory-cookies')) {
	setTimeout(() => {
		cookies.classList.add('fade-in-2');

		cookiesBtn.addEventListener('click', function () {
			localStorage.setItem('fun-factory-cookies', true);

			cookies.classList.add('fade-out-2');
			cookies.classList.remove('fade-in-2');
		})

		cookiesClose.addEventListener('click', function () {
			cookies.classList.add('fade-out-2');
			cookies.classList.remove('fade-in-2');
		})
	},2000)
} else {
	if(cookies) cookies.remove();
}

// =-=-=-=-=-=-=-=-=-=-=-=- </cookies> -=-=-=-=-=-=-=-=-=-=-=-=
