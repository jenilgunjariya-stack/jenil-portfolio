// ==========================================================================
//   Live Clock Functionality
// ==========================================================================
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format to HH:MM:SS AM/PM
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    clockElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Update clock immediately, then every second
updateClock();
setInterval(updateClock, 1000);

// ==========================================================================
//   Mobile Navigation Toggle
// ==========================================================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ==========================================================================
//   Sticky Header & Active Link Switching
// ==========================================================================
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    // Add glassmorphism header on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active link switching based on scroll position
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
});

// ==========================================================================
//   Scroll Animations (Intersection Observer)
// ==========================================================================
const fadeElements = document.querySelectorAll('.fade-up');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

fadeElements.forEach(element => {
    appearOnScroll.observe(element);
});

// ==========================================================================
//   Form Submission Handling (Prevent Default)
// ==========================================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        
        fetch("https://formsubmit.co/ajax/jenilgunjariya@gmail.com", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                alert('Oops! Something went wrong. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! Something went wrong. Please check your connection and try again.');
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}
