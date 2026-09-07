/* GK TAX CONSULTING IKE — site.js
   Vanilla, no dependencies. Safe to serve statically (GitHub Pages). */
(function () {
	'use strict';

	var header  = document.getElementById('header');
	var nav     = document.getElementById('nav');
	var burger  = document.getElementById('burger');
	var totop   = document.getElementById('totop');
	var links   = nav ? nav.querySelectorAll('a[href*="#"]') : [];

	/* ---- Mobile drawer -------------------------------------------------- */
	var scrim = document.getElementById('scrim');

	function setMenu(open) {
		if (!nav || !burger) return;
		nav.classList.toggle('is-open', open);
		burger.setAttribute('aria-expanded', String(open));
		burger.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
		if (scrim) {
			scrim.hidden = false;
			scrim.classList.toggle('is-on', open);
		}
		document.body.style.overflow = open ? 'hidden' : '';
	}

	if (burger && nav) {
		burger.addEventListener('click', function () {
			setMenu(!nav.classList.contains('is-open'));
		});

		if (scrim) scrim.addEventListener('click', function () { setMenu(false); });

		nav.addEventListener('click', function (e) {
			if (e.target.closest('a')) setMenu(false);
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && nav.classList.contains('is-open')) {
				setMenu(false);
				burger.focus();
			}
		});

		window.addEventListener('resize', function () {
			if (window.innerWidth > 900 && nav.classList.contains('is-open')) setMenu(false);
		});
	}

	/* ---- Sticky header + back-to-top ----------------------------------- */
	var ticking = false;
	function onScroll() {
		var y = window.pageYOffset || document.documentElement.scrollTop;
		if (header) header.classList.toggle('is-stuck', y > 12);
		if (totop)  totop.classList.toggle('is-on', y > 620);
		ticking = false;
	}
	window.addEventListener('scroll', function () {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(onScroll);
		}
	}, { passive: true });
	onScroll();

	/* ---- Reveal on scroll ---------------------------------------------- */
	var reveals = document.querySelectorAll('[data-reveal]');
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in');
					io.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

		Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
	} else {
		Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
	}

	/* ---- Active section in nav ----------------------------------------- */
	var sections = [];
	Array.prototype.forEach.call(links, function (a) {
		var href = a.getAttribute('href') || '';
		var hash = href.slice(href.indexOf('#'));
		if (hash.length > 1 && href.indexOf('#') === 0) {
			var el = document.querySelector(hash);
			if (el) sections.push({ link: a, el: el });
		}
	});

	if (sections.length && 'IntersectionObserver' in window) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				sections.forEach(function (s) {
					s.link.classList.toggle('is-active', s.el === entry.target);
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

		sections.forEach(function (s) { spy.observe(s.el); });
	}

	/* ---- Footer year ---------------------------------------------------- */
	var year = document.getElementById('year');
	if (year) year.textContent = String(new Date().getFullYear());
})();
