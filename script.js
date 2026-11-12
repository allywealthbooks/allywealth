/* =====================================================================
   ALLY WEALTH - MASTER JAVASCRIPT
   Description: Handles all site-wide interactivity, animations, 
   mobile navigation, filtering, and form submissions.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* =================================================================
       1. PRELOADER
       ================================================================= */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Remove from DOM after transition to prevent interference
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 800); // 800ms delay to show the animation
        });
    }

    /* =================================================================
       2. MOBILE NAVIGATION & DROPDOWNS
       ================================================================= */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenuBtn && navLinks) {
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && !link.parentElement.classList.contains('dropdown')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Mobile Dropdown Toggle (Mega Menu)
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    /* =================================================================
       3. STICKY NAVBAR
       ================================================================= */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on initial load
    }

    /* =================================================================
       4. SCROLL REVEAL ANIMATIONS
       ================================================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    /* =================================================================
       5. HERO PARALLAX EFFECT
       ================================================================= */
    const heroParallax = document.getElementById('hero-parallax');
    if (heroParallax) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroParallax.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        });
    }

    /* =================================================================
       6. ANIMATED NUMBER COUNTERS (Trust Bar)
       ================================================================= */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length > 0) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            entry.target.innerText = Math.ceil(count) + '+';
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = target + '+';
                        }
                    };
                    
                    updateCount();
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => countObserver.observe(num));
    }

    /* =================================================================
       7. FAQ ACCORDION
       ================================================================= */
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const parent = question.parentElement;
            
            // Close all other open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current FAQ
            parent.classList.toggle('active');
            
            if (parent.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    /* =================================================================
       8. RESOURCES PAGE - ARTICLE FILTERING
       ================================================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');

    if (filterBtns.length > 0 && articleCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                articleCards.forEach(card => {
                    // If 'all' is selected or if the card matches the category
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        // Trigger a small reflow for animation
                        void card.offsetWidth; 
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // Wait for transition to finish
                    }
                });
            });
        });
    }

    /* =================================================================
       9. SMOOTH SCROLL FOR ANCHOR LINKS
       ================================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =================================================================
       10. FORMSPREE AJAX SUBMISSION
       ================================================================= */
    const forms = document.querySelectorAll('form[action^="https://formspree.io"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Find the status div within this specific form, or fallback to global ID
            const formStatus = form.querySelector('.form-status') || document.getElementById('form-status');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';

            if (formStatus) {
                formStatus.innerHTML = "Sending...";
                formStatus.className = "form-status sending";
            }
            
            if (submitBtn) {
                submitBtn.innerText = "Sending...";
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }

            const data = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.innerHTML = "Thank you! Your enquiry has been sent successfully. We will be in touch soon.";
                        formStatus.className = "form-status success";
                    }
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (formStatus) {
                        if (responseData.errors) {
                            formStatus.innerHTML = responseData.errors.map(error => error.message).join(", ");
                        } else {
                            formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.className = "form-status error";
                    }
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.innerHTML = "Oops! There was a problem submitting your form. Please check your connection and try again.";
                    formStatus.className = "form-status error";
                }
            } finally {
                if (submitBtn) {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            }
        });
    });

});