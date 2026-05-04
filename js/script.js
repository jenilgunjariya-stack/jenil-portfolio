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
        
        // Validation check
        const name = formData.get('name');
        const email = formData.get('email');
        const mobile = formData.get('mobile');
        const subject = formData.get('_subject');
        const message = formData.get('message');

        if (!name || !email || !mobile || !subject || !message) {
            alert('Please fill in all details before sending.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        // 10-digit validation
        if (mobile.length !== 10 || isNaN(mobile)) {
            alert('Please enter exactly 10 digits for the mobile number.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        // Add country code (+91) for the saved data and email
        const fullMobile = "+91 " + mobile;
        formData.set('mobile', fullMobile);
        
        fetch("https://formsubmit.co/ajax/jenilgunjariya@gmail.com", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Save to localStorage for Admin Panel
                const newMessage = {
                    id: Date.now(),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    mobile: fullMobile,
                    subject: formData.get('_subject'),
                    message: formData.get('message'),
                    date: new Date().toLocaleString()
                };
                
                let savedMessages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
                savedMessages.unshift(newMessage); // Add to beginning
                localStorage.setItem('portfolio_messages', JSON.stringify(savedMessages));

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

// ==========================================================================
//   Admin Login Logic
// ==========================================================================
const adminLoginTriggers = document.querySelectorAll('.admin-login-trigger');
adminLoginTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const pwd = prompt("Enter Admin Password:");
        if (pwd === "261106") {
            sessionStorage.setItem('isAdmin', 'true');
            window.location.href = "admin.html";
        } else if (pwd !== null) {
            alert("Incorrect Password!");
        }
    });
});

// Only allow digits in the mobile input
const mobileInput = document.getElementById('mobile');
if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// ==========================================================================
//   Resume Download Functionality (High-Quality PDF Generation)
// ==========================================================================
const resumeBtns = document.querySelectorAll('#downloadResume, #downloadResumeBtn, #downloadResumeHero');

resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        btn.style.pointerEvents = 'none';

        // Create a temporary container for the resume
        const resumeContainer = document.createElement('div');
        resumeContainer.style.position = 'fixed';
        resumeContainer.style.left = '0';
        resumeContainer.style.top = '0';
        resumeContainer.style.width = '100%';
        resumeContainer.style.height = 'auto';
        resumeContainer.style.zIndex = '-9999';
        resumeContainer.style.opacity = '0';
        resumeContainer.style.pointerEvents = 'none';
        
        resumeContainer.innerHTML = `
            <div id="pdf-content" style="width: 750px; padding: 40px; background: #fff; color: #1a1a1a; font-family: 'Inter', Arial, sans-serif; line-height: 1.5; margin: auto;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid #d4af37; padding-bottom: 20px; margin-bottom: 25px;">
                    <div>
                        <h1 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 36px; color: #000; text-transform: uppercase;">JENIL GUNJARIYA</h1>
                        <p style="margin: 5px 0 8px 0; color: #d4af37; font-weight: 700; font-size: 18px; letter-spacing: 1px;">FULL STACK WEB DEVELOPER</p>
                        <div style="font-size: 13px; color: #333;">
                            <p style="margin: 2px 0;"><strong>Location:</strong> Gujarat, India</p>
                            <p style="margin: 2px 0;"><strong>Email:</strong> jenilgunjariya@gmail.com</p>
                            <p style="margin: 2px 0;"><strong>Phone:</strong> +91 97274 08352</p>
                        </div>
                    </div>
                    <img src="https://i.postimg.cc/C1thHZ3r/logo.jpg" style="width: 70px; height: 70px; border-radius: 5px; border: 1px solid #eee;">
                </div>

                <!-- Profile Summary -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #d4af37; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">Profile Summary</h3>
                    <p style="text-align: justify; font-size: 14px; color: #222;">
                        Passionate Full Stack Web Developer skilled in building responsive and scalable web applications. Experienced in developing real-world e-commerce platforms with modern technologies.
                    </p>
                </div>

                <!-- Technical Skills -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #d4af37; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">Technical Skills</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                        <div><strong>Frontend:</strong> HTML, CSS, JavaScript, React</div>
                        <div><strong>Backend:</strong> Node.js, Express</div>
                        <div><strong>Database:</strong> MongoDB, Firebase</div>
                        <div><strong>Tools:</strong> Git, Vercel, Netlify</div>
                    </div>
                </div>

                <!-- Professional Experience -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #d4af37; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">Professional Experience</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h4 style="margin: 0; font-size: 15px; color: #000;">Lead Developer & Founder</h4>
                            <span style="font-size: 12px; color: #666; font-weight: 600;">2026 - Present</span>
                        </div>
                        <p style="margin: 2px 0; font-size: 13px; color: #d4af37; font-weight: 600;">V-WOOD QUARTZ (Wall Clock Business)</p>
                        <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 13px; color: #333;">
                            <li>Designed and developed a fully functional e-commerce website from scratch.</li>
                            <li>Integrated Firebase/Firestore for real-time order synchronization.</li>
                        </ul>
                    </div>

                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h4 style="margin: 0; font-size: 15px; color: #000;">Freelance Web Developer</h4>
                            <span style="font-size: 12px; color: #666; font-weight: 600;">2024 - 2026</span>
                        </div>
                        <p style="margin: 2px 0; font-size: 13px; color: #d4af37; font-weight: 600;">Independent</p>
                        <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 13px; color: #333;">
                            <li>Created responsive landing pages and portfolios for local businesses.</li>
                        </ul>
                    </div>
                </div>

                <!-- Education -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #d4af37; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">Education</h3>
                    <div>
                        <h4 style="margin: 0; font-size: 15px; color: #d4af37;">MADHUBEN & BHANUBHAU PATEL INSTITUTE OF TECHNOLOGY (MBIT)</h4>
                        <p style="margin: 3px 0; font-size: 13px; color: #555;">NEW VALLABH VIDHYANAGR</p>
                        <p style="margin: 0; font-size: 14px; color: #000;"><strong>Course Name:</strong> B.TECH</p>
                    </div>
                </div>

                <!-- Achievements -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #d4af37; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 16px; margin-bottom: 10px;">Achievements & Highlights</h3>
                    <div style="font-size: 14px; color: #222;">
                        <p style="margin: 4px 0;">✔ Built real-world e-commerce website</p>
                        <p style="margin: 4px 0;">✔ Deployed live project</p>
                        <p style="margin: 4px 0;">✔ Responsive design for all devices</p>
                    </div>
                </div>

                <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
                    © 2026 Jenil Gunjariya | Portfolio Resume
                </div>
            </div>
        `;

        document.body.appendChild(resumeContainer);

        const opt = {
            margin: 0,
            filename: 'Jenil_Gunjariya_Resume.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#ffffff',
                scrollY: 0
            },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Delay to ensure rendering is complete
        setTimeout(() => {
            html2pdf().from(resumeContainer.querySelector('#pdf-content')).set(opt).save().then(() => {
                document.body.removeChild(resumeContainer);
                btn.innerHTML = originalContent;
                btn.style.pointerEvents = 'auto';
            }).catch(err => {
                console.error('PDF Error:', err);
                if (document.body.contains(resumeContainer)) {
                    document.body.removeChild(resumeContainer);
                }
                btn.innerHTML = originalContent;
                btn.style.pointerEvents = 'auto';
            });
        }, 1000); // 1 second delay to be safe
    });
});
