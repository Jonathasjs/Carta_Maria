document.addEventListener("DOMContentLoaded", () => {
    // Registrar Plugins do GSAP
    gsap.registerPlugin(ScrollTrigger);

    initIntroAnimations();
    initAmbientParticles();
    initCustomAudioPlayer();
    initHorizontalGallery();
});

/* ==========================================================================
   1. INTRODUÇÃO CINEMATOGRÁFICA & TRANSIÇÃO
   ========================================================================== */
function initIntroAnimations() {
    const tl = gsap.timeline();

    // Fade-in sequencial minimalista da intro
    tl.to("#intro-p1", { opacity: 1, duration: 2, ease: "power2.out" })
      .to("#intro-p2", { opacity: 1, duration: 2, ease: "power2.out" }, "-=0.8")
      .to("#start-btn", { opacity: 1, duration: 1.5, ease: "power1.out" }, "-=0.5");

    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", () => {
        // Tocar a música nativa contornando a restrição de autoplay do navegador
        const audio = document.getElementById("bg-music");
        const playerContainer = document.getElementById("audio-player");
        
        audio.play().then(() => {
            playerContainer.classList.add("playing");
        }).catch(err => console.log("Áudio aguardando interação:", err));

        // Transição refinada da tela de intro para a experiência
        gsap.to("#intro-section", {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => {
                document.getElementById("intro-section").style.display = "none";
                const mainContent = document.getElementById("main-content");
                mainContent.style.display = "block";
                
                // Mostrar os elementos principais de forma fluida
                gsap.to(mainContent, { opacity: 1, duration: 2, ease: "power1.out" });
                gsap.to(playerContainer, { opacity: 1, duration: 1.5 });

                // Ativar os triggers de scroll somente após a entrada do main
                initScrollAnimations();
                initLiveCounter();
            }
        });
    });
}

/* ==========================================================================
   2. ANIMAÇÕES BASEADAS EM SCROLL (GSAP & ScrollTrigger)
   ========================================================================== */
function initScrollAnimations() {
    // A Carta Viva: Efeito de acendimento palavra por palavra / parágrafo por parágrafo
    const paragraphs = document.querySelectorAll(".letter-p");
    paragraphs.forEach((p) => {
        gsap.to(p, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: p,
                start: "top 85%",
                end: "top 50%",
                toggleActions: "play none none none",
                // Descomente a linha abaixo caso queira que o texto apague ao subir de volta (estilo cinema)
                // scrub: true 
            }
        });
    });

    // Seção Significado dos Presentes
    const giftItems = document.querySelectorAll(".gift-item");
    gsap.to(giftItems, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".gifts-section",
            start: "top 75%",
        }
    });

    // Seção Timeline Nodes
    const nodes = document.querySelectorAll(".timeline-node, .timeline-connector");
    nodes.forEach((node) => {
        gsap.fromTo(node, 
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: node,
                    start: "top 80%"
                }
            }
        );
    });

    // Encerramento Emocional
    gsap.to("#final-msg-1", {
        opacity: 1,
        duration: 2.5,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: ".final-section",
            start: "top 60%"
        }
    });

    gsap.to("#final-msg-2", {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".final-section",
            start: "top 40%"
        }
    });
}

/* ==========================================================================
   3. CONTADOR DINÂMICO AUTOMÁTICO (Desde 26/04/2025)
   ========================================================================== */
function initLiveCounter() {
    // Data de início especificada no briefing: 26/04/2025
    const startDate = new Date("2025-04-26T00:00:00").getTime();

    function updateCounter() {
        const now = new Date().getTime();
        const difference = now - startDate;

        if (difference < 0) return; // Salvaguarda caso a data fosse futura

        // Cálculos matemáticos de tempo
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Atualizar o DOM injetando zero à esquerda se menor que 10
        document.getElementById("count-days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("count-hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("count-minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("count-seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    // Executar imediatamente e definir o loop contínuo de 1s
    updateCounter();
    setInterval(updateCounter, 1000);
}

/* ==========================================================================
   4. PLAYER DE ÁUDIO LUXURY CUSTOMIZADO
   ========================================================================== */
function initCustomAudioPlayer() {
    const audio = document.getElementById("bg-music");
    const playerContainer = document.getElementById("audio-player");

    playerContainer.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playerContainer.classList.add("playing");
        } else {
            audio.pause();
            playerContainer.classList.remove("playing");
        }
    });
}

/* ==========================================================================
   5. GALERIA HORIZONTAL COM SWIPE / DRAG OTIMIZADO
   ========================================================================== */
function initHorizontalGallery() {
    const slider = document.getElementById("gallery-viewport-id") || document.querySelector(".gallery-viewport");
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; // Velocidade de arrasto
        slider.scrollLeft = scrollLeft - walk;
    });
}

/* ==========================================================================
   6. PARTÍCULAS DISCRETAS E FLUIDAS DE FUNDO (HTML5 Canvas)
   ========================================================================== */
function initAmbientParticles() {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = 40; // Quantidade sutil para preservar performance e design clean

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height + height; // Começa sempre abaixo da tela visível
            this.size = Math.random() * 1.5 + 0.5; // Partículas minúsculas
            this.speedY = -(Math.random() * 0.4 + 0.1); // Subida bem lenta e elegante
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeSpeed = 0.002;
        }

        update() {
            this.y += this.speedY;
            // Reposicionar se sair do topo da tela
            if (this.y < 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Tom dourado luxo sutil
            ctx.fill();
        }
    }

    // Inicializar array de partículas em posições aleatórias da tela inteira na primeira execução
    for (let i = 0; i < maxParticles; i++) {
        const p = new Particle();
        p.y = Math.random() * height; // Distribuídos uniformemente
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    // Redimensionamento responsivo inteligente do canvas
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}
