// ===== AOS INITIALIZATION =====
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    disable: 'mobile'
});

// ===== MOBILE NAVIGATION =====
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-link');
        }
    });
});

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounters = () => {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const rect = counter.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            let count = 0;
            const increment = target / 60;
            
            const updateCounter = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        }
    });
};

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', () => {
    setTimeout(animateCounters, 500);
});

// ===== SKILL BAR ANIMATION =====
const skillBars = document.querySelectorAll('.skill-bar div');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        }
    });
};

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            animateSkillBars();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('load', () => {
    setTimeout(animateSkillBars, 500);
});

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // ✅ Validation
        if (name === '' || name.length < 2) {
            showMessage('❌ Please enter your full name.', 'error');
            return;
        }

        if (email === '') {
            showMessage('❌ Please enter your email address.', 'error');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showMessage('❌ Please enter a valid email address.', 'error');
            return;
        }

        if (message === '' || message.length < 10) {
            showMessage('❌ Please enter your message (min 10 characters).', 'error');
            return;
        }

        showMessage('⏳ Sending your message...', 'success');

        const formData = new FormData(contactForm);

        // ✅ Formspree pe send karein
        fetch('https://formspree.io/f/mwleyqva', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showMessage('✅ Thank you! Your message has been sent successfully!', 'success');
                contactForm.reset();
            } else {
                // ✅ Error ka exact reason dekhein
                return response.text().then(text => {
                    console.log('Formspree Error:', text);
                    showMessage('❌ Error: ' + text, 'error');
                });
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            showMessage('❌ Network error. Please check your connection.', 'error');
        });
    });
}

function showMessage(msg, type) {
    if (!formMessage) return;
    formMessage.textContent = msg;
    formMessage.className = 'form-message ' + type;
    
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 6000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== HEADER SHADOW =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// ===== RESUME DOWNLOAD =====
const resumeBtn = document.querySelector('.resume__btn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // ✅ Resume download karne ke liye
        // Apni PDF file ka naam sahi rakhein
        const pdfUrl = 'Sonal_Resume.pdf';
        
        // Check karein ki file exist karti hai ya nahi
        fetch(pdfUrl)
            .then(response => {
                if (response.ok) {
                    // ✅ File exist karti hai - download karein
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = 'Sonal_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showNotification('📄 Download started!');
                } else {
                    // ❌ File nahi mili
                    showNotification('❌ Resume file not found! Please add Sonal_Resume.pdf to your folder.', 'error');
                }
            })
            .catch(() => {
                showNotification('❌ Error downloading resume. Please try again.', 'error');
            });
    });
}

// ===== PROJECT LINKS =====
// ✅ Social links ab kaam karenge - kuch block nahi karna

// ===== CERTIFICATE LINKS =====
// ✅ Certificate links ab kaam karenge - kuch block nahi karna

// ===== NOTIFICATION =====
function showNotification(msg, type) {
    let notification = document.querySelector('.custom-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 14, 26, 0.95);
            backdrop-filter: blur(20px);
            color: #fff;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            font-family: 'Inter', sans-serif;
            max-width: 90%;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.4s ease;
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        `;
        document.body.appendChild(notification);
    }

    // Agar error hai toh red color
    if (type === 'error') {
        notification.style.borderColor = '#ff6b6b';
        notification.style.color = '#ff6b6b';
    } else {
        notification.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        notification.style.color = '#fff';
    }

    notification.textContent = msg;
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
    }, 4000);
}

console.log('🚀 Sonal\'s Portfolio loaded successfully!');
console.log('✨ Built with ❤️ using HTML, CSS, & JavaScript');