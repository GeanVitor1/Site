// Configuração do Particles.js para criar um efeito de fundo "Genshin Impact / Espacial"
document.addEventListener("DOMContentLoaded", function() {
    // (Efeito de opacidade removido)

    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#9b51e0", "#d18ce0", "#ffffff"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#9b51e0",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "top",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 200,
                        "size": 6,
                        "duration": 2,
                        "opacity": 0.8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // Click to Reveal Logic and Music Player
    const photoCards = document.querySelectorAll('.photo-card');
    const prankCard = document.getElementById('card-1');
    let currentAudio = null;
    let currentActiveCard = null;

    function playMusic(src, card) {
        if (!src) return;

        const playBtn = card.querySelector('.play-pause-btn i');
        const progressBar = card.querySelector('.progress-bar');

        if (currentAudio && currentActiveCard === card) {
            if (currentAudio.paused) {
                currentAudio.play();
                playBtn.className = 'fas fa-pause';
            } else {
                currentAudio.pause();
                playBtn.className = 'fas fa-play';
            }
            return;
        }

        // New audio
        if (currentAudio) {
            currentAudio.pause();
            if (currentActiveCard) {
                const prevBtn = currentActiveCard.querySelector('.play-pause-btn i');
                if (prevBtn) prevBtn.className = 'fas fa-play';
            }
        }

        currentAudio = new Audio(src);
        currentActiveCard = card;

        currentAudio.play();
        playBtn.className = 'fas fa-pause';

        // Update Progress Bar
        currentAudio.ontimeupdate = () => {
            if (progressBar) {
                const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                progressBar.value = progress || 0;
            }
        };

        // Reset when finished
        currentAudio.onended = () => {
            playBtn.className = 'fas fa-play';
            if (progressBar) progressBar.value = 0;
        };

        // Handle progress bar seek
        if (progressBar) {
            progressBar.oninput = () => {
                const seekTime = (progressBar.value / 100) * currentAudio.duration;
                currentAudio.currentTime = seekTime;
            };
        }
    }

    if (prankCard) {
        prankCard.addEventListener('click', function() {
            if (this.classList.contains('revealed')) return;
            this.classList.add('revealed');

            // Reveal all other cards
            photoCards.forEach((card, index) => {
                if (card !== prankCard) {
                    setTimeout(() => {
                        card.classList.add('revealed');
                    }, 500 + (index * 150));
                }
            });
        });
    }

    // Intro Music Player Logic
    const introCard = document.querySelector('.intro-music-card');
    let introAudio = document.getElementById('intro-audio-element');

    if (introCard && introAudio) {
        const playBtn = introCard.querySelector('.play-pause-btn');
        const progressBar = introCard.querySelector('.progress-bar');

        const updateUI = () => {
            if (introAudio.paused) {
                playBtn.querySelector('i').className = 'fas fa-play';
            } else {
                playBtn.querySelector('i').className = 'fas fa-pause';
            }
        };

        introAudio.ontimeupdate = () => {
            const progress = (introAudio.currentTime / introAudio.duration) * 100;
            progressBar.value = progress || 0;
        };

        introAudio.onended = () => {
            updateUI();
            progressBar.value = 0;
        };

        // Muted autoplay strategy
        introAudio.muted = true;
        
        const startAudio = () => {
            introAudio.muted = false;
            introAudio.play().then(() => {
                updateUI();
                // Remove listeners once it starts playing and is unmuted
                ['click', 'scroll', 'touchstart', 'mousemove', 'keydown'].forEach(evt => 
                    window.removeEventListener(evt, startAudio)
                );
            }).catch(() => {
                // Still blocked, will try again on next interaction
            });
        };

        // Try to play muted instantly
        introAudio.play().then(() => {
            console.log("Muted autoplay started");
        }).catch(() => {
            console.log("Muted autoplay blocked, waiting for interaction");
        });

        ['click', 'scroll', 'touchstart', 'mousemove', 'keydown'].forEach(evt => 
            window.addEventListener(evt, startAudio, { once: false })
        );

        playBtn.addEventListener('click', (e) => {
            // No stopPropagation to let startAudio also try if needed
            if (introAudio.paused) {
                // Pause other audio
                if (currentAudio) {
                    currentAudio.pause();
                    if (currentActiveCard) {
                        const prevBtn = currentActiveCard.querySelector('.play-pause-btn i');
                        if (prevBtn) prevBtn.className = 'fas fa-play';
                    }
                }
                // Pausar vídeos
                document.querySelectorAll('video').forEach(v => v.pause());

                introAudio.play().then(updateUI);
            } else {
                introAudio.pause();
                updateUI();
            }
        });

        progressBar.addEventListener('input', () => {
            if (introAudio) {
                const seekTime = (progressBar.value / 100) * introAudio.duration;
                introAudio.currentTime = seekTime;
            }
        });

        progressBar.addEventListener('input', () => {
            if (introAudio) {
                const seekTime = (progressBar.value / 100) * introAudio.duration;
                introAudio.currentTime = seekTime;
            }
        });

        // Auto-stop intro music when scrolling down to main site
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && introAudio && !introAudio.paused) {
                    introAudio.pause();
                    playBtn.querySelector('i').className = 'fas fa-play';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(document.getElementById('intro-section'));
    }

    // Photo Cards Music Logic (Existing)
    photoCards.forEach((card) => {
        if (card === prankCard) return;

        card.addEventListener('click', function(e) {
            // Se clicar no botão de play, no range ou em um vídeo, não faz o flip
            if (e.target.closest('.player-controls') || e.target.tagName.toLowerCase() === 'video') return;

            if (!this.classList.contains('revealed')) return;

            // Toggle Flip
            this.classList.toggle('flipped');

            // Video logic
            const video = this.querySelector('video');
            if (video) {
                const playIcon = this.querySelector('.play-pause-btn i');
                if (this.classList.contains('flipped')) {
                    // Parar música da intro se estiver tocando
                    if (introAudio && !introAudio.paused) {
                        introAudio.pause();
                        const introBtn = introCard.querySelector('.play-pause-btn i');
                        if (introBtn) introBtn.className = 'fas fa-play';
                    }
                    // Parar música de outros cards
                    if (currentAudio) {
                        currentAudio.pause();
                        if (currentActiveCard) {
                            const prevBtn = currentActiveCard.querySelector('.play-pause-btn i');
                            if (prevBtn) prevBtn.className = 'fas fa-play';
                        }
                    }
                    // Pausar outros vídeos
                    document.querySelectorAll('video').forEach(v => {
                        if (v !== video) {
                            v.pause();
                            const vCard = v.closest('.photo-card');
                            if (vCard) {
                                const vIcon = vCard.querySelector('.play-pause-btn i');
                                if (vIcon) vIcon.className = 'fas fa-play';
                            }
                        }
                    });
                    
                    video.play();
                    if (playIcon) playIcon.className = 'fas fa-pause';
                } else {
                    video.pause();
                    if (playIcon) playIcon.className = 'fas fa-play';
                }
                return;
            }

            // Se virar para o verso, toca a música
            if (this.classList.contains('flipped')) {
                // Parar música da intro se estiver tocando
                if (introAudio && !introAudio.paused) {
                    introAudio.pause();
                    const introBtn = introCard.querySelector('.play-pause-btn i');
                    if (introBtn) introBtn.className = 'fas fa-play';
                }
                // Pausar vídeos
                document.querySelectorAll('video').forEach(v => {
                    v.pause();
                    const vCard = v.closest('.photo-card');
                    if (vCard) {
                        const vIcon = vCard.querySelector('.play-pause-btn i');
                        if (vIcon) vIcon.className = 'fas fa-play';
                    }
                });

                const musicSrc = this.getAttribute('data-music');
                if (musicSrc) playMusic(musicSrc, this);
            }
        });

        // Evento específico para o botão de play/pause no verso
        const playBtn = card.querySelector('.play-pause-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const video = card.querySelector('video');
                const icon = playBtn.querySelector('i');

                // Parar música da intro se estiver tocando
                if (introAudio && !introAudio.paused) {
                    introAudio.pause();
                    const introBtn = introCard.querySelector('.play-pause-btn i');
                    if (introBtn) introBtn.className = 'fas fa-play';
                }

                if (video) {
                    if (video.paused) {
                        // Pausar outras mídias
                        if (currentAudio) {
                            currentAudio.pause();
                            if (currentActiveCard) {
                                const prevBtn = currentActiveCard.querySelector('.play-pause-btn i');
                                if (prevBtn) prevBtn.className = 'fas fa-play';
                            }
                        }
                        document.querySelectorAll('video').forEach(v => {
                            if (v !== video) {
                                v.pause();
                                const vCard = v.closest('.photo-card');
                                if (vCard) {
                                    const vIcon = vCard.querySelector('.play-pause-btn i');
                                    if (vIcon) vIcon.className = 'fas fa-play';
                                }
                            }
                        });
                        video.play();
                        icon.className = 'fas fa-pause';
                    } else {
                        video.pause();
                        icon.className = 'fas fa-play';
                    }
                } else {
                    // Lógica para música
                    document.querySelectorAll('video').forEach(v => {
                        v.pause();
                        const vCard = v.closest('.photo-card');
                        if (vCard) {
                            const vIcon = vCard.querySelector('.play-pause-btn i');
                            if (vIcon) vIcon.className = 'fas fa-play';
                        }
                    });
                    const musicSrc = card.getAttribute('data-music');
                    playMusic(musicSrc, card);
                }
            });
        }

        // Lógica de progresso para vídeos
        const video = card.querySelector('video');
        if (video) {
            const progressBar = card.querySelector('.progress-bar');
            if (progressBar) {
                video.addEventListener('timeupdate', () => {
                    const progress = (video.currentTime / video.duration) * 100;
                    progressBar.value = progress || 0;
                });
                
                video.addEventListener('ended', () => {
                    const icon = card.querySelector('.play-pause-btn i');
                    if (icon) icon.className = 'fas fa-play';
                    progressBar.value = 0;
                });

                progressBar.addEventListener('input', (e) => {
                    e.stopPropagation();
                    const seekTime = (progressBar.value / 100) * video.duration;
                    video.currentTime = seekTime;
                });
            }
        }
    });
});
