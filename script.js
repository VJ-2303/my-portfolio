// DOM Elements
const nav = document.getElementById('nav');
const typingText = document.getElementById('typing-text');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Mobile Menu Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Typing animation for console
const commands = [
    'whoami',
    'cat skills.txt',
    'ls projects/',
    'git status',
    'npm run dev',
    'python ai_chatbot.py',
    'code .',
    'Building the future...'
];

let currentCommandIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeCommand() {
    const currentCommand = commands[currentCommandIndex];
    
    if (!isDeleting) {
        // Typing
        typingText.textContent = currentCommand.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentCommand.length) {
            // Pause before deleting
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        }
    } else {
        // Deleting
        typingText.textContent = currentCommand.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentCommandIndex = (currentCommandIndex + 1) % commands.length;
        }
    }
    
    // Adjust typing speed
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeCommand, speed);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeCommand, 1000);
});

// Navigation visibility on scroll
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavigation() {
    const scrollY = window.scrollY;
    const scrollThreshold = 100;
    
    if (scrollY > scrollThreshold) {
        nav.classList.add('visible');
    } else {
        nav.classList.remove('visible');
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavigation);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100; // Account for fixed nav
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(targetId);
        }
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink(activeId = null) {
    if (activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
        return;
    }
    
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.project-card, .skill-category, .profile-card, .description-card, .stat-card, .timeline-card, .interests-card, .contact-card, .contact-hero-content, .contact-social'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                submitButton.textContent = 'Message Sent!';
                submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                contactForm.reset();
                
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 3000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            submitButton.textContent = 'Try Again';
            submitButton.disabled = false;
            showNotification('Failed to send message. Please try again.', 'error');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
            }, 3000);
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    
    // Type-specific styles
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Parallax effect for background blobs
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.blob');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Throttled parallax update
let parallaxTicking = false;

function requestParallaxTick() {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
        setTimeout(() => {
            parallaxTicking = false;
        }, 16); // ~60fps
    }
}

window.addEventListener('scroll', requestParallaxTick);

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button if needed
document.addEventListener('DOMContentLoaded', () => {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        font-size: 1.25rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 100;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(100px)';
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC to close any modals or overlays
    if (e.key === 'Escape') {
        // Close any open modals, notifications, etc.
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
    
    // Ctrl/Cmd + K to focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if exists
    }
});

// Performance optimization: Reduce animations on low-end devices
function checkPerformance() {
    // Simple performance check
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     navigator.connection?.effectiveType === 'slow-2g' ||
                     navigator.connection?.effectiveType === '2g';
    
    if (isLowEnd) {
        document.body.classList.add('reduce-animations');
        
        // Add CSS for reduced animations
        const style = document.createElement('style');
        style.textContent = `
            .reduce-animations * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            .reduce-animations .blob {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
}

checkPerformance();

// Lazy loading for project images (if added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Console easter egg
console.log(`
┌─────────────────────────────────────┐
│                                     │
│   🚀 Welcome to Vanaraj's Portfolio │
│                                     │
│   Built with passion and modern     │
│   web technologies.                 │
│                                     │
│   Interested in the code?           │
│   Check out: github.com/Vanaraj10   │
│                                     │
└─────────────────────────────────────┘
`);

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = modal.querySelector('.contact-form');
        if (form) form.reset();
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
    
    // Handle ESC key for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeContactModal();
        }
    });
});

// Enhanced contact form handling for modal
document.addEventListener('DOMContentLoaded', () => {
    const modalForm = document.querySelector('#contactModal .contact-form');
    
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = modalForm.querySelector('.btn-primary');
            const originalContent = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(modalForm);
                const response = await fetch(modalForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    submitButton.innerHTML = '<span>Message Sent!</span>';
                    submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    
                    // Show success message
                    showNotification('Project proposal sent successfully! I\'ll review it and get back to you within 24 hours.', 'success');
                    
                    // Close modal after delay
                    setTimeout(() => {
                        closeContactModal();
                        submitButton.innerHTML = originalContent;
                        submitButton.disabled = false;
                        submitButton.style.background = '';
                    }, 2000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                submitButton.innerHTML = '<span>Try Again</span>';
                submitButton.disabled = false;
                showNotification('Failed to send proposal. Please try again or contact me directly.', 'error');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalContent;
                }, 3000);
            }
        });
    }
});

// ====== NEW AWESOME TECH BACKGROUND FUNCTIONALITY ======

// Neural Network Connections Generator
function createNeuralConnections() {
    const svg = document.querySelector('.neural-connections');
    const nodes = document.querySelectorAll('.node');
    
    if (!svg || nodes.length === 0) return;
    
    // Clear existing connections
    svg.innerHTML = '';
    
    // Create connections between nodes in adjacent layers
    nodes.forEach(node => {
        const currentLayer = parseInt(node.dataset.layer);
        const currentPosition = parseInt(node.dataset.position);
        
        // Connect to nodes in the next layer
        if (currentLayer < 4) {
            nodes.forEach(targetNode => {
                const targetLayer = parseInt(targetNode.dataset.layer);
                const targetPosition = parseInt(targetNode.dataset.position);
                
                if (targetLayer === currentLayer + 1) {
                    // Create connection line
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    
                    // Calculate positions
                    const nodeRect = node.getBoundingClientRect();
                    const targetRect = targetNode.getBoundingClientRect();
                    const svgRect = svg.getBoundingClientRect();
                    
                    line.setAttribute('x1', nodeRect.left - svgRect.left + nodeRect.width / 2);
                    line.setAttribute('y1', nodeRect.top - svgRect.top + nodeRect.height / 2);
                    line.setAttribute('x2', targetRect.left - svgRect.left + targetRect.width / 2);
                    line.setAttribute('y2', targetRect.top - svgRect.top + targetRect.height / 2);
                    
                    // Add random delay for animation
                    line.style.animationDelay = `${Math.random() * 2}s`;
                    
                    svg.appendChild(line);
                }
            });
        }
    });
}

// Matrix Rain Animation
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters (mix of binary, code symbols, and AI-related terms)
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]()<>/\\|&*%$#@!^+-=~`;:?.';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }
    
    function drawMatrix() {
        // Semi-transparent black background for trailing effect
        ctx.fillStyle = 'rgba(15, 15, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Matrix text
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            // Reset drop randomly or when it reaches bottom
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Start animation
    setInterval(drawMatrix, 50);
}

// Enhanced Particle Interactions
function initParticleInteractions() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Add mouse interaction
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(1.5)';
            particle.style.color = 'rgba(168, 85, 247, 1)';
            particle.style.textShadow = '0 0 20px rgba(168, 85, 247, 1)';
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = '';
            particle.style.color = '';
            particle.style.textShadow = '';
        });
        
        // Add random interactive pulses
        setInterval(() => {
            if (Math.random() > 0.8) {
                particle.style.animation = 'none';
                particle.offsetHeight; // Trigger reflow
                particle.style.animation = null;
            }
        }, 5000 + Math.random() * 10000);
    });
}

// Dynamic Neural Network Activity
function animateNeuralNetwork() {
    const nodes = document.querySelectorAll('.node');
    
    nodes.forEach(node => {
        setInterval(() => {
            if (Math.random() > 0.7) {
                node.style.animation = 'none';
                node.offsetHeight; // Trigger reflow
                node.style.animation = null;
                
                // Add temporary glow effect
                node.style.boxShadow = '0 0 40px rgba(99, 102, 241, 1)';
                setTimeout(() => {
                    node.style.boxShadow = '';
                }, 1000);
            }
        }, 3000 + Math.random() * 5000);
    });
}

// Geometric Shapes Interactive Behavior
function initGeometricShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach(shape => {
        // Add click interaction
        shape.addEventListener('click', () => {
            shape.style.transform = 'scale(1.5) rotate(720deg)';
            shape.style.opacity = '0.8';
            
            setTimeout(() => {
                shape.style.transform = '';
                shape.style.opacity = '';
            }, 1000);
        });
        
        // Add random color changes
        setInterval(() => {
            if (Math.random() > 0.9) {
                const colors = [
                    'rgba(99, 102, 241, 0.3)',
                    'rgba(168, 85, 247, 0.3)',
                    'rgba(245, 158, 11, 0.3)',
                    'rgba(239, 68, 68, 0.3)',
                    'rgba(34, 197, 94, 0.3)'
                ];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                if (shape.classList.contains('triangle')) {
                    shape.style.borderBottomColor = randomColor;
                } else if (shape.classList.contains('circle')) {
                    shape.style.borderColor = randomColor;
                } else {
                    shape.style.backgroundColor = randomColor;
                }
                
                setTimeout(() => {
                    shape.style.borderBottomColor = '';
                    shape.style.borderColor = '';
                    shape.style.backgroundColor = '';
                }, 2000);
            }
        }, 8000 + Math.random() * 12000);
    });
}

// Performance-optimized background updates
function updateBackgroundEffects() {
    // Only update if elements are visible
    if (document.hidden) return;
    
    // Throttled neural network updates
    if (Math.random() > 0.98) {
        animateNeuralNetwork();
    }
    
    // Update particle positions based on scroll
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const offset = scrollPercent * 50 * (index % 3 + 1);
        particle.style.transform = `translateY(${offset}px)`;
    });
}

// Initialize all background effects
function initAwesomeBackground() {
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        createNeuralConnections();
        initMatrixRain();
        initParticleInteractions();
        animateNeuralNetwork();
        initGeometricShapes();
        
        // Start background effect updates
        setInterval(updateBackgroundEffects, 100);
        
        // Recreate neural connections on resize
        window.addEventListener('resize', () => {
            setTimeout(createNeuralConnections, 100);
        });
    }, 500);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAwesomeBackground);

// Make functions globally available
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;

// Export functions for potential use
window.portfolioUtils = {
    scrollToTop,
    showNotification,
    updateActiveNavLink
};

// Mobile Navigation Toggle
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Event Listeners
navToggle.addEventListener('click', toggleMobileMenu);

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});
