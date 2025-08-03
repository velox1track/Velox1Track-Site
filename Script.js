// Mobile Navigation Toggle
console.log('Script.js loaded successfully');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Handle navigation links - allow external page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an external page link (contains .html)
            if (href && href.includes('.html')) {
                // Allow normal navigation to external pages
                // Just close mobile menu if open
                if (navToggle && navMenu) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                }
                // Don't prevent default - let the link work normally
                return;
            }
            
            // For internal page anchors (starting with #), handle smooth scrolling
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Close mobile menu if open
                    if (navToggle && navMenu) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navMenu.classList.remove('active');
                    }
                    
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Digital Roulette Animation
    const activateButton = document.querySelector('#activate-button');
    const digitalScreen = document.querySelector('.digital-screen');
    const screenTitle = document.querySelector('.digital-screen-title');
    const screenResult = document.querySelector('.digital-screen-result');
    
    // Initialize button with hidden state
    if (activateButton) {
        // CSS handles the initial hidden state
        console.log('Button found for initialization');
    }
    
    // Quick Facts Accordion Functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Intersection Observer for button animation on scroll
    const rouletteSection = document.querySelector('.roulette-interactive');
    
    if (rouletteSection && activateButton) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger button animation when section comes into view
                    setTimeout(() => {
                        activateButton.classList.add('reveal');
                        // Apply the styling when button becomes visible
                        activateButton.style.opacity = '1';
                        activateButton.style.transform = 'translateY(0)';
                        console.log('Button revealed on scroll');
                    }, 300); // Small delay for dramatic effect
                    
                    // Only trigger once
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the section is visible
            rootMargin: '0px 0px -100px 0px' // Trigger earlier
        });
        
        observer.observe(rouletteSection);
    }
    
    // Race options from the event types section
    const raceOptions = [
        '100 Meters',
        '200 Meters', 
        '300 Meters',
        '400 Meters',
        '800 Meters',
        '1 Kilometer',
        '1.2 Kilometers',
        '1 Mile',
        '4 x 100 Meter Relay',
        '4 x 400 Meter Relay',
        '100 - 100 - 200 - 400 Meter Relay',
        '200 - 200 - 400 - 800 Meter Relay'
    ];
    
    let lastSelectedRace = null;
    let isAnimating = false;
    let isFirstAnimation = true; // Track if this is the first animation
    
    // Check if we're on the format page (where the button exists)
    if (activateButton) {
        console.log('Activate button found');
        
        if (digitalScreen && screenTitle && screenResult) {
            console.log('All digital screen elements found');
            // Set initial state on the button
            activateButton.setAttribute('data-first-animation', 'true');
            
            // Start button hidden for scroll animation
            activateButton.style.display = 'inline-block';
            activateButton.style.opacity = '0';
            activateButton.style.transform = 'translateY(20px)';
            activateButton.style.background = '#2a2a2a';
            activateButton.style.color = '#64E2D3';
            activateButton.style.border = '3px solid #64E2D3';
            activateButton.style.padding = '18px 36px';
            activateButton.style.borderRadius = '12px';
            activateButton.style.fontFamily = "'Roboto Mono', monospace";
            activateButton.style.fontSize = '16px';
            activateButton.style.fontWeight = '700';
            activateButton.style.textTransform = 'uppercase';
            activateButton.style.cursor = 'pointer';
            activateButton.style.position = 'relative';
            activateButton.style.overflow = 'hidden';
            activateButton.style.letterSpacing = '0.1em';
            activateButton.style.marginTop = '24px';
            activateButton.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(100, 226, 211, 0.3)';
            
            // Simple debugging setup
            console.log('Button initialized with text:', activateButton.textContent);
            
            activateButton.addEventListener('click', function() {
            if (isAnimating) return; // Prevent multiple clicks
            
            console.log('Button clicked - isFirstAnimation:', isFirstAnimation);
            console.log('Button text before click:', this.textContent);
            isAnimating = true;
            
            // Disable button during animation
            this.disabled = true;
            this.textContent = 'LOADING EVENT...';
            
            // Add animating class to screen
            digitalScreen.classList.add('animating');
            
            // Hide title and show result area
            screenTitle.style.opacity = '0';
            screenResult.style.opacity = '1';
            
            // Start the roulette animation
            startRouletteAnimation();
        });
        } else {
            console.log('Digital screen elements not found');
        }
    } else {
        console.log('Activate button not found');
    }
    
    function startRouletteAnimation() {
        let currentIndex = 0;
        const animationDuration = 3000; // 3 seconds
        const interval = 100; // Update every 100ms
        const steps = animationDuration / interval;
        let currentStep = 0;
        
        const animationInterval = setInterval(() => {
            // Select a random race (avoiding the last selected one)
            let selectedRace;
            do {
                selectedRace = raceOptions[Math.floor(Math.random() * raceOptions.length)];
            } while (selectedRace === lastSelectedRace && raceOptions.length > 1);
            
            // Update the display with animation
            screenResult.textContent = selectedRace;
            screenResult.style.opacity = '1';
            screenResult.style.transform = 'scale(1.1)';
            screenResult.style.textAlign = 'center';
            screenResult.style.display = 'flex';
            screenResult.style.alignItems = 'center';
            screenResult.style.justifyContent = 'center';
            
            // Reset transform after a brief moment
            setTimeout(() => {
                screenResult.style.transform = 'scale(1)';
            }, 50);
            
            currentStep++;
            
            // Slow down towards the end
            if (currentStep > steps * 0.7) {
                clearInterval(animationInterval);
                setTimeout(() => {
                    // Final selection
                    const finalRace = raceOptions[Math.floor(Math.random() * raceOptions.length)];
                    screenResult.textContent = finalRace;
                    screenResult.classList.add('revealing');
                    lastSelectedRace = finalRace;
                    
                    // Add final reveal effect
                    screenResult.style.transform = 'scale(1.2)';
                    screenResult.style.textShadow = '0 0 30px rgba(100, 226, 211, 1)';
                    
                    setTimeout(() => {
                        screenResult.style.transform = 'scale(1)';
                        screenResult.style.textShadow = '0 0 15px rgba(100, 226, 211, 0.8)';
                    }, 300);
                    
                    // Stop animation effects
                    digitalScreen.classList.remove('animating');
                    isAnimating = false;
                    
                    // Re-enable button
                    const button = document.querySelector('#activate-button');
                    button.disabled = false;
                    
                    // Set button text based on whether this is the first animation
                    console.log('Setting button text - isFirstAnimation:', isFirstAnimation);
                    
                    if (isFirstAnimation) {
                        button.textContent = 'NEXT EVENT';
                        isFirstAnimation = false; // Mark that first animation is complete
                        console.log('First animation complete - showing NEXT EVENT');
                    } else {
                        button.textContent = 'NEXT EVENT';
                        console.log('Subsequent animation - showing NEXT EVENT');
                    }
                    console.log('Final button text:', button.textContent);
                    
                    // Keep the styling applied
                    console.log('Animation complete - keeping button styling');
                    
                    // Add flash effect
                    setTimeout(() => {
                        digitalScreen.style.boxShadow = '0 0 40px rgba(100, 226, 211, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.8)';
                        setTimeout(() => {
                            digitalScreen.style.boxShadow = '0 0 30px rgba(100, 226, 211, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.8)';
                        }, 200);
                    }, 500);
                    
                }, 500);
            }
        }, interval);
    }
    
    // Contact form submission (Formspree)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data for validation
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!firstName || !lastName || !email || !subject || !message) {
                e.preventDefault();
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Allow the form to submit to Formspree
            // Formspree will handle the submission and show success message
            // We'll reset the form after Formspree processes it
            setTimeout(() => {
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
        });
    }
    
    // Stay Updated form submission (Formspree)
    const stayUpdatedForm = document.querySelector('#stay-updated-form');
    if (stayUpdatedForm) {
        stayUpdatedForm.addEventListener('submit', function(e) {
            // Get form data for validation
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            
            // Basic validation
            if (!name || !email) {
                e.preventDefault();
                alert('Please fill in both name and email fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Allow the form to submit to Formspree
            // Formspree will handle the submission and show success message
            // We'll reset the form after Formspree processes it
            setTimeout(() => {
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
        });
    }
    
    // Social link interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('span').textContent.toLowerCase();
            // Add your social media redirect logic here
            console.log(`Redirecting to ${platform}`);
        });
    });
    

});

// Add CSS animation for roulette wheel spin
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { 
            transform: rotate(0deg); 
        }
        20% { 
            transform: rotate(180deg); 
        }
        50% { 
            transform: rotate(540deg); 
        }
        80% { 
            transform: rotate(900deg); 
        }
        100% { 
            transform: rotate(var(--final-rotation, 1080deg)); 
        }
    }
    
    .roulette-wheel-foreground {
        transition: transform 0.1s ease-out;
        /* Optimize for mobile performance */
        will-change: transform;
        transform: translateZ(0);
    }
`;
document.head.appendChild(style);

// Logo Animation V2 Logic with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    const logoAnimationV2 = {
        elements: {
            vSeparate: document.getElementById('logo-v-separate'),
            oneSeparate: document.getElementById('logo-1-separate'),
            vOverlap: document.getElementById('logo-v-overlap'),
            oneOverlap: document.getElementById('logo-1-overlap'),
            part3: document.getElementById('logo-part3'),
            final: document.getElementById('logo-final')
        },
        
        isAnimating: false,
        animationInterval: null,
        
        // Initialize animation with intersection observer
        init: function() {
            // Check if logo elements exist
            if (!this.elements.vSeparate || !this.elements.oneSeparate) {
                console.warn('Logo elements not found - skipping initialization');
                return;
            }
            
            // Find the logo container (hero section)
            const logoContainer = document.querySelector('.hero');
            
            if (!logoContainer) {
                console.warn('Logo container not found');
                return;
            }
            
            // Create intersection observer with optimized timing
            let logoAnimationStartTimeout = null;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isAnimating) {
                        // Logo is in view, start animation after a delay
                        // Shorter delay for mobile, longer for desktop
                        const isMobile = window.innerWidth <= 768;
                        const delay = isMobile ? 500 : 800; // 500ms mobile, 800ms desktop
                        
                        logoAnimationStartTimeout = setTimeout(() => {
                            this.startAnimation();
                        }, delay);
                    } else if (!entry.isIntersecting && this.isAnimating) {
                        // Logo is out of view, stop animation
                        this.stopAnimation();
                    } else if (!entry.isIntersecting && logoAnimationStartTimeout) {
                        // If user scrolls away before delay, clear timeout
                        clearTimeout(logoAnimationStartTimeout);
                        logoAnimationStartTimeout = null;
                    }
                });
            }, {
                threshold: 0.4, // Trigger when 40% of the logo is visible (better visibility)
                rootMargin: '0px 0px -100px 0px' // Trigger earlier for better timing
            });
            
            // Start observing the logo container
            observer.observe(logoContainer);
            
            // Initialize elements in reset state
            this.resetElements();
        },
        
        // Start the animation cycle
        startAnimation: function() {
            console.log('Starting animation cycle, isAnimating:', this.isAnimating);
            if (this.isAnimating) {
                console.log('Animation already running, skipping');
                return;
            }
            
            this.isAnimating = true;
            console.log('Animation started, calling startPhase1');
            this.startPhase1();
        },
        
        // Stop the animation cycle
        stopAnimation: function() {
            this.isAnimating = false;
            if (this.animationInterval) {
                clearTimeout(this.animationInterval);
                this.animationInterval = null;
            }
            this.resetElements();
        },
        
        // Reset all elements to initial state
        resetElements: function() {
            console.log('Resetting logo elements to initial state');
            
            // Hide overlap and part3 elements
            if (this.elements.vOverlap) {
                this.elements.vOverlap.style.opacity = '0';
                this.elements.vOverlap.style.display = 'none';
            }
            if (this.elements.oneOverlap) {
                this.elements.oneOverlap.style.opacity = '0';
                this.elements.oneOverlap.style.display = 'none';
            }
            if (this.elements.part3) {
                this.elements.part3.style.opacity = '0';
                this.elements.part3.style.display = 'none';
            }
            
            // Reset separate elements to initial positions
            if (this.elements.vSeparate) {
                this.elements.vSeparate.style.transform = 'translateX(-100%)';
                this.elements.vSeparate.style.opacity = '1';
                this.elements.vSeparate.style.display = 'block';
            }
            if (this.elements.oneSeparate) {
                this.elements.oneSeparate.style.transform = 'translateX(100%)';
                this.elements.oneSeparate.style.opacity = '1';
                this.elements.oneSeparate.style.display = 'block';
            }
            
            console.log('Logo elements reset complete');
        },
        
        // Start Phase 1 animation
        startPhase1: function() {
            if (!this.isAnimating) return;
            
            // V and 1 slide in from opposite sides
            // The CSS animations will handle the sliding motion
            
            // After animation completes, show the final logo and stop the cycle
            this.animationInterval = setTimeout(() => {
                if (this.isAnimating) {
                    this.showFinalLogo();
                    
                    // Stop the animation cycle - don't restart automatically
                    this.isAnimating = false;
                    console.log('Animation cycle complete - waiting for click to restart');
                }
            }, 2000); // Animation completes after 2 seconds
        },
        
        // Force restart animation (for click functionality)
        restartAnimation: function() {
            console.log('Restarting logo animation');
            
            // Stop any ongoing animation
            this.stopAnimation();
            
            // Clear any existing timeouts
            if (this.animationInterval) {
                clearTimeout(this.animationInterval);
                this.animationInterval = null;
            }
            
            // First, hide the final logo (if it's visible)
            if (this.elements.final) {
                this.elements.final.style.opacity = '0';
                this.elements.final.style.display = 'none';
                this.elements.final.style.visibility = 'hidden';
            }
            
            // Reset elements to initial state
            this.resetElements();
            
            // Force CSS animation restart by removing and re-adding classes
            if (this.elements.vSeparate) {
                this.elements.vSeparate.style.animation = 'none';
                this.elements.vSeparate.offsetHeight; // Trigger reflow
                this.elements.vSeparate.style.animation = null;
            }
            
            if (this.elements.oneSeparate) {
                this.elements.oneSeparate.style.animation = 'none';
                this.elements.oneSeparate.offsetHeight; // Trigger reflow
                this.elements.oneSeparate.style.animation = null;
            }
            
            // Shorter delay since we're not hiding everything
            setTimeout(() => {
                console.log('Starting animation after reset');
                this.startAnimation();
            }, 100);
        },
        
        // Hide all elements to prevent visual overlap
        hideAllElements: function() {
            console.log('Hiding all logo elements');
            
            // Hide all elements immediately
            Object.values(this.elements).forEach(element => {
                if (element) {
                    element.style.opacity = '0';
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                }
            });
        },
        
        // Show final logo (for when animation completes)
        showFinalLogo: function() {
            console.log('Showing final logo');
            
            // Hide all other elements
            if (this.elements.vSeparate) this.elements.vSeparate.style.opacity = '0';
            if (this.elements.oneSeparate) this.elements.oneSeparate.style.opacity = '0';
            if (this.elements.vOverlap) this.elements.vOverlap.style.opacity = '0';
            if (this.elements.oneOverlap) this.elements.oneOverlap.style.opacity = '0';
            if (this.elements.part3) this.elements.part3.style.opacity = '0';
            
            // Show final logo by triggering the CSS animation
            if (this.elements.final) {
                // Reset the animation
                this.elements.final.style.animation = 'none';
                this.elements.final.offsetHeight; // Trigger reflow
                
                // Apply the same CSS animation as the original
                this.elements.final.style.animation = 'finalLogoCrossfade 0.3s ease-in-out forwards';
                this.elements.final.style.display = 'block';
                this.elements.final.style.visibility = 'visible';
            }
        }
    };
    
    // Initialize Logo Animation V2 only if logo elements exist
    console.log('Checking logo elements:', {
        vSeparate: logoAnimationV2.elements.vSeparate,
        oneSeparate: logoAnimationV2.elements.oneSeparate,
        container: document.querySelector('.logo-animation-v2-container')
    });
    
    // Always add click functionality regardless of animation state
    const logoContainer = document.querySelector('.logo-animation-v2-container');
    console.log('Logo container found:', logoContainer);
    
    if (logoContainer) {
        // Add click functionality to replay animation
        logoContainer.addEventListener('click', function(e) {
            console.log('Logo clicked - replaying animation', e);
            e.preventDefault();
            e.stopPropagation();
            
            // Force restart the animation
            if (logoAnimationV2.elements.vSeparate && logoAnimationV2.elements.oneSeparate) {
                logoAnimationV2.restartAnimation();
            } else {
                console.log('Logo elements not found for restart');
            }
        });
        
        // Add cursor pointer to indicate clickability
        logoContainer.style.cursor = 'pointer';
        
        // Add hover effect with subtle animation hint
        logoContainer.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        });
        
        logoContainer.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Add touch feedback for mobile
        logoContainer.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
            this.style.transform = 'scale(0.98)';
        });
        
        logoContainer.addEventListener('touchend', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        console.log('Click event listener added to logo container');
    } else {
        console.log('Logo container not found');
    }
    
    // Initialize animation if elements exist
    if (logoAnimationV2.elements.vSeparate && logoAnimationV2.elements.oneSeparate) {
        console.log('Logo elements found - initializing animation');
        logoAnimationV2.init();
    } else {
        console.log('Logo animation disabled - elements not found');
    }
});
