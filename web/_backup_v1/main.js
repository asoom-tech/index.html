/* ═══════════════════════════════════════════
   MIHWAR | محور — Interactions & Animations
   ═══════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── Preloader ───
    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initRevealAnimations();
        }
    }

    // Hide preloader after content loads
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 800);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hidePreloader, 800);
        });
    }

    // Safety: hide preloader after 3s max
    setTimeout(hidePreloader, 3000);

    // ─── Navbar Scroll ───
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let ticking = false;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link
        updateActiveNavLink();

        // Show floating WhatsApp
        const floatingWA = document.querySelector('.floating-whatsapp');
        if (floatingWA) {
            if (scrollY > 400) {
                floatingWA.classList.add('visible');
            } else {
                floatingWA.classList.remove('visible');
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    // ─── Active Nav Link ───
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 120;

        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ─── Mobile Menu ───
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ─── Smooth Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Reveal on Scroll ───
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal-up, .reveal-scale');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        // Respect transition-delay via CSS
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            reveals.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show all
            reveals.forEach(function(el) {
                el.classList.add('revealed');
            });
        }
    }

    // ─── FAQ Accordion ───
    document.querySelectorAll('.faq-question').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Close all other items
            document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ─── Service Cards Hover Effect ───
    document.querySelectorAll('.service-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.setProperty('--card-accent', 'var(--yellow)');
        });
    });

    // ─── Contact Form → WhatsApp ───
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>جارٍ الإرسال...</span>';
            btn.disabled = true;

            const name = contactForm.querySelector('#name').value || '';
            const business = contactForm.querySelector('#business').value || '';
            const type = contactForm.querySelector('#type').value || '';
            const service = contactForm.querySelector('#service').value || '';
            const phone = contactForm.querySelector('#phone').value || '';
            const email = contactForm.querySelector('#email').value || '';
            const message = contactForm.querySelector('#message').value || '';

            let body = 'مرحبا، أريد حجز مكالمة استشارية معكم\n\n';
            body += 'الاسم: ' + name + '\n';
            body += 'اسم المنشأة: ' + business + '\n';
            body += 'نوع النشاط: ' + type + '\n';
            body += 'المطلوب: ' + service + '\n';
            body += 'رقم التواصل: ' + phone + '\n';
            if (email) body += 'البريد: ' + email + '\n';
            if (message) body += 'الرسالة: ' + message + '\n';

            const whatsappUrl = 'https://wa.me/972592059611?text=' + encodeURIComponent(body);
            window.open(whatsappUrl, '_blank');

            btn.innerHTML = '<span>تم فتح واتساب ✓</span>';
            btn.style.background = '#25D366';
            btn.style.color = 'white';

            setTimeout(function() {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    // Parallax removed: it caused text-selection freezing and layout thrashing.

    // ─── Counter animation for process numbers ───
    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = String(Math.floor(current)).padStart(2, '0');
        }, 30);
    }

    // ─── Keyboard navigation support ───
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // ─── Performance: lazy load non-critical elements ───
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            // Any deferred initialization can go here
        });
    }

})();
