// JAVASCRIPT - HUELLITAS AL MICTLÁN 2026

document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMACIÓN CANVAS: PETALOS DE CEMPASÚCHIL
    const canvas = document.getElementById('cempasuchil-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const petals = [];
    const petalCount = 35;

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
            this.color = Math.random() > 0.3 ? '#ff6f00' : '#ffd54f';
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.angle += this.spin;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();


    // 2. INTERACCIÓN CON EL ALTAR VIRTUAL
    const inputPetName = document.getElementById('input-pet-name');
    const inputDedication = document.getElementById('input-dedication');
    const btnUpdateAltar = document.getElementById('btn-update-altar');
    const altarPetName = document.getElementById('altar-pet-name');
    const displayDedication = document.getElementById('display-dedication');
    const altarMessageBox = document.getElementById('altar-message-box');

    const btnToggleCandle = document.getElementById('btn-toggle-candle');
    const flame = document.getElementById('flame');

    // Actualizar nombre y dedicatoria
    btnUpdateAltar.addEventListener('click', () => {
        const nameVal = inputPetName.value.trim();
        const dedVal = inputDedication.value.trim();

        if (nameVal !== '') {
            altarPetName.textContent = `🐾 ${nameVal}`;
            if (dedVal !== '') {
                displayDedication.textContent = `"${dedVal}"`;
                altarMessageBox.classList.remove('hidden');
            } else {
                altarMessageBox.classList.add('hidden');
            }
            alert(`¡${nameVal} ha sido inscrito(a) en la ofrenda del CBTis 246! 🌼`);
        } else {
            alert('Por favor, escribe el nombre de tu mascota.');
        }
    });

    // Encender/Apagar Veladora
    btnToggleCandle.addEventListener('click', () => {
        flame.classList.toggle('hidden');
        if (!flame.classList.contains('hidden')) {
            btnToggleCandle.textContent = '🕯️ Apagar Veladora';
        } else {
            btnToggleCandle.textContent = '🕯️ Encender Veladora';
        }
    });


    // 3. MODAL DEL REGLAMENTO
    const modal = document.getElementById('modal-reglamento');
    const btnOpenModal = document.getElementById('btn-modal-reglamento');
    const btnCloseModal = document.querySelector('.close-modal');

    btnOpenModal.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });


    // 4. MÚSICA AMBIENTAL SINTETIZADA CON WEB AUDIO API
    const audioBtn = document.getElementById('audio-toggle-btn');
    let audioCtx = null;
    let isPlaying = false;
    let timerId = null;

    const pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Do, Re, Mi, Sol, La, Do

    function playSoftNote() {
        if (!isPlaying || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const randomFreq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(randomFreq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 3.0);
    }

    audioBtn.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (!isPlaying) {
            audioCtx.resume();
            isPlaying = true;
            audioBtn.textContent = '🔊 Pausar Música Ambient';
            timerId = setInterval(playSoftNote, 1200);
        } else {
            isPlaying = false;
            audioBtn.textContent = '🎵 Activar Música Ambient';
            clearInterval(timerId);
        }
    });
});
