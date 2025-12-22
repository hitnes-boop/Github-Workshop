// Presentation JavaScript
class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 1;
        this.totalSlides = this.slides.length;

        this.progressBar = document.getElementById('progressBar');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');

        this.init();
    }

    init() {
        // Update total slides count
        this.totalSlidesEl.textContent = this.totalSlides;

        // Button events
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/Swipe support
        this.setupTouch();

        // Click navigation
        document.getElementById('slidesContainer').addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            if (e.clientX > rect.width / 2) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        });

        // Initial update
        this.updateUI();

        // Hide keyboard hint after 5 seconds
        setTimeout(() => {
            const hint = document.getElementById('keyboardHint');
            if (hint) hint.style.opacity = '0';
        }, 5000);

        // URL hash support
        this.checkHash();
        window.addEventListener('hashchange', () => this.checkHash());
    }

    goToSlide(n) {
        if (n < 1 || n > this.totalSlides) return;

        // Remove active from current
        this.slides[this.currentSlide - 1].classList.remove('active');

        // Update current slide
        this.currentSlide = n;

        // Add active to new slide
        this.slides[this.currentSlide - 1].classList.add('active');

        // Update UI
        this.updateUI();

        // Update URL hash
        history.replaceState(null, null, `#${this.currentSlide}`);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateUI() {
        // Update counter
        this.currentSlideEl.textContent = this.currentSlide;

        // Update progress bar
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;

        // Update button states
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;

        this.prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }

    setupTouch() {
        let touchStartX = 0;
        let touchEndX = 0;

        const container = document.getElementById('slidesContainer');

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const diff = touchStartX - touchEndX;
            const threshold = 50;

            if (diff > threshold) {
                this.nextSlide();
            } else if (diff < -threshold) {
                this.prevSlide();
            }
        };

        this.handleSwipe = handleSwipe;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    checkHash() {
        const hash = window.location.hash.slice(1);
        const slideNum = parseInt(hash);
        if (slideNum && slideNum >= 1 && slideNum <= this.totalSlides) {
            this.goToSlide(slideNum);
        }
    }
}

// Initialize presentation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new Presentation();
});

// Console message
console.log('%c🎓 GitHub Workshop Sunum', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cKlavye: ← → gezinme, F tam ekran', 'font-size: 12px; color: #94a3b8;');
