/* ═══════════════════════════════════════════
   MIHWAR 20 | محور ٢٠ — Interactions
   Axis · Search · Visibility · Connection · Growth
   ═══════════════════════════════════════════ */

(function() {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─── Preloader ─── */
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initReveals();
        }
    }
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, reduceMotion ? 100 : 900);
    } else {
        window.addEventListener('load', () => setTimeout(hidePreloader, reduceMotion ? 100 : 900));
    }
    setTimeout(hidePreloader, 3000); // safety

    /* ─── Navbar on scroll ─── */
    const navbar = document.getElementById('navbar');
    const scrollAxis = document.getElementById('scrollAxis');
    const floatingWA = document.querySelector('.floating-whatsapp');
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;

        if (navbar) navbar.classList.toggle('scrolled', y > 20);
        if (scrollAxis && scrollAxis.firstElementChild) {
            scrollAxis.firstElementChild.style.height = (h > 0 ? (y / h) * 100 : 0) + '%';
        }
        if (floatingWA) floatingWA.classList.toggle('visible', y > 400);

        updateActiveNav();
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    /* ─── Active nav link ─── */
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        const pos = window.scrollY + 140;
        let current = '';
        sections.forEach(s => {
            if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id;
        });
        links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    }

    /* ─── Mobile menu ─── */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const open = mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        document.querySelectorAll('.mobile-link, .mobile-cta-primary').forEach(a => {
            a.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ─── Smooth scroll for anchors ─── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 70,
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    /* ─── Reveal on scroll ─── */
    function initReveals() {
        const els = document.querySelectorAll('.reveal, .reveal-scale');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('revealed'));
            lightDashboards();
            return;
        }
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    const d = en.target.dataset.delay || 0;
                    setTimeout(() => en.target.classList.add('revealed'), d);
                    obs.unobserve(en.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        els.forEach(el => io.observe(el));

        // axis line in process
        const pAxis = document.querySelector('.process-axis');
        if (pAxis) {
            new IntersectionObserver((en, obs) => {
                if (en[0].isIntersecting) { pAxis.classList.add('lit'); obs.disconnect(); }
            }, { threshold: 0.3 }).observe(pAxis);
        }
        lightDashboards();
    }

    /* ─── Dashboard chart draw ─── */
    function lightDashboards() {
        document.querySelectorAll('.dashboard').forEach(d => {
            const io = new IntersectionObserver((en, obs) => {
                if (en[0].isIntersecting) { d.classList.add('lit'); obs.disconnect(); }
            }, { threshold: 0.25 });
            io.observe(d);
        });
    }

    /* ─── Typing query in hero ─── */
    const queryEl = document.getElementById('typingQuery');
    if (queryEl && !reduceMotion) {
        const queries = [
            'أفضل شركة تصميم مواقع في فلسطين؟',
            'Best SEO agency near me?',
            'أين أجد خدمة تحسين الظهور محليًا؟'
        ];
        let qi = 0, ci = 0, deleting = false;
        function type() {
            const q = queries[qi];
            queryEl.textContent = q.substring(0, ci);
            if (!deleting) {
                if (ci < q.length) { ci++; setTimeout(type, 55); }
                else { deleting = true; setTimeout(type, 2400); }
            } else {
                if (ci > 0) { ci--; setTimeout(type, 28); }
                else { deleting = false; qi = (qi + 1) % queries.length; setTimeout(type, 400); }
            }
        }
        setTimeout(type, 1200);
    } else if (queryEl) {
        queryEl.textContent = 'أفضل شركة تصميم مواقع في فلسطين؟';
    }

    /* ─── AI node sequential activation ─── */
    const nodes = document.querySelectorAll('.ai-node');
    if (nodes.length && !reduceMotion) {
        let ni = 0;
        setInterval(() => {
            nodes.forEach(n => n.classList.remove('active'));
            nodes[ni].classList.add('active');
            ni = (ni + 1) % nodes.length;
        }, 1800);
    }

    /* ─── Number counters ─── */
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const dec = parseInt(el.dataset.decimals || 0, 10);
        const dur = 1800;
        const start = performance.now();
        function fmt(v) {
            return v.toLocaleString('en-US', {
                minimumFractionDigits: dec,
                maximumFractionDigits: dec
            });
        }
        function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            el.textContent = fmt(target * eased);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = fmt(target);
        }
        requestAnimationFrame(step);
    }
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            counters.forEach(c => {
                const t = parseFloat(c.dataset.target);
                const d = parseInt(c.dataset.decimals || 0, 10);
                c.textContent = t.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
            });
        } else {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(en => {
                    if (en.isIntersecting) { animateCounter(en.target); obs.unobserve(en.target); }
                });
            }, { threshold: 0.4 });
            counters.forEach(c => io.observe(c));
        }
    }

    /* ─── FAQ accordion ─── */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item.open').forEach(o => {
                o.classList.remove('open');
                o.querySelector('.faq-answer').style.maxHeight = null;
                o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ─── Magnetic buttons ─── */
    if (!reduceMotion && window.matchMedia('(hover: hover) and (min-width: 900px)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    /* ─── Subtle parallax on hero visual ─── */
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && !reduceMotion) {
        let pticking = false;
        window.addEventListener('scroll', () => {
            if (!pticking) {
                requestAnimationFrame(() => {
                    heroVisual.style.transform = `translateY(${window.scrollY * 0.08}px)`;
                    pticking = false;
                });
                pticking = true;
            }
        }, { passive: true });
    }

    /* ─── Contact form → WhatsApp ─── */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = '<span>جارٍ الإرسال...</span>';
            btn.disabled = true;

            const g = id => (form.querySelector('#' + id) || {}).value || '';
            let body = 'مرحبا، أريد حجز استشارة مجانية\n\n';
            body += 'الاسم: ' + g('name') + '\n';
            body += 'اسم المنشأة: ' + g('business') + '\n';
            body += 'نوع النشاط: ' + g('type') + '\n';
            body += 'المطلوب: ' + g('service') + '\n';
            body += 'رقم التواصل: ' + g('phone') + '\n';
            if (g('email')) body += 'البريد: ' + g('email') + '\n';
            if (g('message')) body += 'الرسالة: ' + g('message') + '\n';

            window.open('https://wa.me/972592059611?text=' + encodeURIComponent(body), '_blank');

            btn.innerHTML = '<span>تم فتح واتساب ✓</span>';
            btn.style.background = '#25D366';
            btn.style.color = '#000';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

})();
