// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

function closeMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
}

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        closeMenu();
    }
});

// ===== SCOPRI DI PIÙ — TOGGLE DETAILS =====
function toggleDetails(sectionId) {
    const details = document.getElementById('details-' + sectionId);
    const btn = details.previousElementSibling.querySelector('.btn-scopri') 
             || details.closest('.porta-card')?.querySelector('.btn-scopri')
             || details.closest('.section-card')?.querySelector('.btn-scopri');

    // Find the correct button
    const card = details.closest('.porta-card') || details.closest('.section-card');
    const button = card.querySelector('.btn-scopri');

    if (details.classList.contains('open')) {
        details.classList.remove('open');
        button.classList.remove('open');
        button.querySelector('.btn-text').textContent = 'Leggi di più';
    } else {
        details.classList.add('open');
        button.classList.add('open');
        button.querySelector('.btn-text').textContent = 'Leggi di meno';
    }
}

// ===== PORTE CAROUSEL =====
let currentPorta = 0;
const slides = document.querySelectorAll('.porta-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    // Close any open details in current slide
    slides.forEach(slide => {
        slide.classList.remove('active');
        const openDetails = slide.querySelector('.card-details.open');
        if (openDetails) {
            openDetails.classList.remove('open');
            const btn = slide.querySelector('.btn-scopri');
            if (btn) {
                btn.classList.remove('open');
                btn.querySelector('.btn-text').textContent = 'Leggi di più';
            }
        }
    });
    indicators.forEach(ind => ind.classList.remove('active'));

    currentPorta = ((index % totalSlides) + totalSlides) % totalSlides;
    slides[currentPorta].classList.add('active');
    indicators[currentPorta].classList.add('active');
}

// Init first slide
showSlide(0);

// Carousel buttons
document.getElementById('prevPorta').addEventListener('click', () => {
    showSlide(currentPorta - 1);
});

document.getElementById('nextPorta').addEventListener('click', () => {
    showSlide(currentPorta + 1);
});

// Indicator clicks
indicators.forEach(ind => {
    ind.addEventListener('click', () => {
        showSlide(parseInt(ind.dataset.index));
    });
});

// ===== TOUCH SWIPE for carousel =====
let touchStartX = 0;
let touchEndX = 0;
const carousel = document.getElementById('porteCarousel');

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            showSlide(currentPorta + 1); // swipe left = next
        } else {
            showSlide(currentPorta - 1); // swipe right = prev
        }
    }
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navAnchors.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + id) {
                    a.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== SIMPLE REVEAL ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ===== INJECT DETAILS FOOTER (Leggi di meno + Sitografia link) =====
document.querySelectorAll('.details-content').forEach(content => {
    const footer = document.createElement('div');
    footer.className = 'details-footer';

    // Find the sectionId for this details panel
    const detailsPanel = content.closest('.card-details');
    const sectionId = detailsPanel ? detailsPanel.id.replace('details-', '') : '';

    footer.innerHTML = `
        <button class="btn-leggi-meno" onclick="toggleDetails('${sectionId}')">
            <span>▲</span> Leggi di meno
        </button>
        <a href="#sitografia" class="btn-sitografia">Vai alla Sitografia →</a>
    `;
    content.appendChild(footer);
});

// ===== CHANGE INITIAL BUTTON TEXT =====
document.querySelectorAll('.btn-scopri .btn-text').forEach(span => {
    span.textContent = 'Leggi di più';
});

document.querySelectorAll('.section-card, .porta-card, .sitografia-list').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
