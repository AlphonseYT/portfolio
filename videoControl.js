class VideoController {
    constructor() {
        this.video = document.getElementById('bgVideo');
        this.isTransitioning = false;
        this.currentPage = window.location.pathname.includes('certificates.html') ? 'certificates' : 'home';
        
        // Time stamps
        this.timeStamps = {
            intro: { start: 0, end: 3 },
            loop: { start: 3, end: 12 },
            outro: { start: 12, end: 15 }
        };

        // Initialize video properties
        this.video.muted = true;
        this.video.playsInline = true;

        this.setupVideoEvents();
        this.setupPageTransition();
        this.setupMobileOptimization();
    }

    setupVideoEvents() {
        // Initial load sequence
        window.addEventListener('load', () => {
            this.playIntro();
        });

        // Handle video transitions
        this.video.addEventListener('timeupdate', () => {
            if (!this.isTransitioning) {
                // During normal loop
                if (this.video.currentTime >= this.timeStamps.loop.end) {
                    this.video.currentTime = this.timeStamps.loop.start;
                }
            }
        });

        // When intro ends, start loop
        this.video.addEventListener('timeupdate', () => {
            if (this.video.currentTime >= this.timeStamps.intro.end && !this.isLooping) {
                this.startLoop();
            }
        });

        // Error handling
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.handleVideoError();
        });
    }

    setupPageTransition() {
        // Handle internal navigation
        document.querySelectorAll('a').forEach(link => {
            if (link.hostname === window.location.hostname) {
                link.addEventListener('click', (e) => {
                    if (link.href.includes('certificates.html') || link.href.includes('index.html')) {
                        e.preventDefault();
                        this.playOutro(() => {
                            window.location.href = link.href;
                        });
                    }
                });
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.playOutro(() => {
                window.location.reload();
            });
        });
    }

    setupMobileOptimization() {
        // Optimize for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.video.setAttribute('playsinline', '');
            this.video.setAttribute('preload', 'auto');
        }

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.video.pause();
            } else {
                this.video.play();
            }
        });
    }

    playIntro() {
        this.video.currentTime = this.timeStamps.intro.start;
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Playback failed:', error);
                this.handleVideoError();
            });
        }
        
        this.isTransitioning = true;
        this.isLooping = false;
    }

    startLoop() {
        this.video.currentTime = this.timeStamps.loop.start;
        this.isTransitioning = false;
        this.isLooping = true;
    }

    playOutro(callback) {
        this.isTransitioning = true;
        this.isLooping = false;
        this.video.currentTime = this.timeStamps.outro.start;
        
        const checkOutroEnd = () => {
            if (this.video.currentTime >= this.timeStamps.outro.end) {
                this.video.removeEventListener('timeupdate', checkOutroEnd);
                if (callback) callback();
            }
        };

        this.video.addEventListener('timeupdate', checkOutroEnd);
    }

    handleVideoError() {
        // Fallback to static background if video fails
        document.querySelector('.video-background').style.backgroundColor = '#000000';
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.style.background = 'linear-gradient(45deg, #000000, #001100)';
        }
    }
}

// Initialize video controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const videoController = new VideoController();
});

// Add touchstart event listener for mobile devices
document.addEventListener('touchstart', () => {
    const video = document.getElementById('bgVideo');
    if (video.paused) {
        video.play().catch(error => console.log('Playback failed:', error));
    }
}, { once: true });
