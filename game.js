/**
 * Dad's CNG Adventure - Core Engine
 * Architecture Design Pattern: Object-Oriented Component Classes managed by a single orchestrator.
 */

// ==========================================
// AUDIO AND SPEECH SYSTEMS
// ==========================================
class SoundManager {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playPickup() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.08); // A5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playDropoff() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    }

    playMilestone() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Multi-frequency fanfare chord
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + (index * 0.05));
            
            gain.gain.setValueAtTime(0.05, now + (index * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + (index * 0.05));
            osc.stop(now + 0.6);
        });
    }
}

class SpeechManager {
    constructor() {
        this.enabled = true;
    }

    speak(text) {
        if (!this.enabled || !('speechSynthesis' in window)) return;
        // Terminate any running speech immediately to handle fast gameplay loops
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.2; // Slightly higher pitch for target demographics
        window.speechSynthesis.speak(utterance);
    }
}

// ==========================================
// GAME ENTITIES
// ==========================================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 54;
        this.height = 42;
        this.speed = 4.5;
        this.angle = 0;
        this.targetAngle = 0;
    }

    update(keys, touchDirections, mapWidth, mapHeight) {
        let dx = 0;
        let dy = 0;

        // Process Desktop Inputs
        if (keys['ArrowUp'] || keys['w']) dy = -1;
        if (keys['ArrowDown'] || keys['s']) dy = 1;
        if (keys['ArrowLeft'] || keys['a']) dx = -1;
        if (keys['ArrowRight'] || keys['d']) dx = 1;

        // Process Overlay Mobile Inputs
        if (touchDirections.up) dy = -1;
        if (touchDirections.down) dy = 1;
        if (touchDirections.left) dx = -1;
        if (touchDirections.right) dx = 1;

        // Apply Movement Profile
        if (dx !== 0 || dy !== 0) {
            this.targetAngle = Math.atan2(dy, dx);
            
            // Normalize velocity vector
            const length = Math.sqrt(dx * dx + dy * dy);
            this.x += (dx / length) * this.speed;
            this.y += (dy / length) * this.speed;

            // Soft interpolation of vehicle angle for aesthetic tracking
            let angleDiff = this.targetAngle - this.angle;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            this.angle += angleDiff * 0.2;
        }

        // Clamp inside safe map margins
        this.x = Math.max(this.width, Math.min(mapWidth - this.width, this.x));
        this.y = Math.max(this.height, Math.min(mapHeight - this.height, this.y));
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Green Bangladeshi CNG Structural Frame Assembly
        ctx.fillStyle = '#008751'; // Primary Forest Green
        ctx.beginPath();
        ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 10);
        ctx.fill();

        // Canvas / Metal Yellow Roof Striping
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(-this.width / 4, -this.height / 2, this.width / 2, 4);
        ctx.fillRect(-this.width / 4, this.height / 2 - 4, this.width / 2, 4);

        // Front Windshield Cabin Assembly (Facing Right)
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.roundRect(this.width / 6, -this.height / 2.5, this.width / 4, this.height * 0.8, 4);
        ctx.fill();
        
        ctx.fillStyle = '#e0f7fa'; // Clean Window Glass Tint
        ctx.fillRect(this.width / 4, -this.height / 3, this.width / 8, this.height * 0.66);

        // Three-Wheel Configuration Profile
        ctx.fillStyle = '#111111';
        // Front Central Control Wheel
        ctx.fillRect(this.width / 2 - 8, -4, 8, 8);
        // Dual Rear High-Stability Traction Wheels
        ctx.fillRect(-this.width / 3, -this.height / 2 - 2, 10, 4);
        ctx.fillRect(-this.width / 3, this.height / 2, 10, 4);

        // Headlight Luminescence Node
        ctx.fillStyle = '#fffde7';
        ctx.beginPath();
        ctx.arc(this.width / 2, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Passenger {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 45;
        this.emojis = ['👵', '👴', '🧒', '🐅', '🐘', '🤖', '🐱', '👨‍🚀'];
        this.type = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        this.pulse = 0;
    }

    draw(ctx) {
        this.pulse += 0.05;
        const scale = 1 + Math.sin(this.pulse) * 0.1; // Soft scaling pulse to capture child attention

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(scale, scale);
        
        // Circular soft indicator aura under the entity
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 10, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Render Entity Node
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type, 0, 0);
        ctx.restore();
    }
}

class Destination {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        
        const locs = [
            { name: "School", icon: "🏫", speech: "Let's go to school!" },
            { name: "Zoo", icon: "🦁", speech: "Time to see the animals at the zoo!" },
            { name: "Playground", icon: "🛝", speech: "Let's go to the playground!" },
            { name: "Ice Cream Shop", icon: "🍦", speech: "Yummy! Let's get ice cream!" },
            { name: "Grandma's House", icon: "🏠", speech: "Let's visit Grandma's house!" }
        ];
        
        this.target = locs[Math.floor(Math.random() * locs.length)];
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // High contrast pulsating target verification indicator rings
        const pulseFactor = (Date.now() % 1000) / 1000;
        ctx.strokeStyle = `rgba(230, 126, 34, ${1 - pulseFactor})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 30 + pulseFactor * 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(241, 196, 15, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();

        // Render Target Node Icon
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.target.icon, 0, 0);
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'star' or 'confetti'
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = type === 'star' ? -Math.random() * 4 - 2 : (Math.random() - 0.5) * 8;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.size = Math.random() * 12 + 12;
        this.alpha = 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.type === 'confetti') {
            this.vy += 0.2; // Add soft gravity tracking to celebration confetti
        }
        this.life -= this.decay;
        this.alpha = Math.max(0, this.life);
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        if (this.type === 'star') {
            ctx.font = `${this.size}px Arial`;
            ctx.fillText('⭐', this.x, this.y);
        } else {
            ctx.fillRect(this.x, this.y, this.size, this.size / 2);
        }
        ctx.restore();
    }
}

// ==========================================
// ENGINE CORE MANAGEMENT
// ==========================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.stars = 0;
        this.trips = 0;
        
        this.keys = {};
        this.touchDirections = { up: false, down: false, left: false, right: false };
        
        this.soundManager = new SoundManager();
        this.speechManager = new SpeechManager();
        
        this.player = null;
        this.passenger = null;
        this.destination = null;
        this.particles = [];
        this.scenery = [];

        this.initDOM();
        this.resizeCanvas();
        this.resetGameEntities();
        this.buildStaticWorldEnvironment();

        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Kick off loop execution
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    initDOM() {
        // Voice Control Interactivity Integration Matrix
        const btnVoice = document.getElementById('voice-toggle');
        btnVoice.addEventListener('click', (e) => {
            this.speechManager.enabled = !this.speechManager.enabled;
            if (this.speechManager.enabled) {
                btnVoice.innerText = "🔊 Voice On";
                btnVoice.classList.remove('muted');
                this.speechManager.speak("Voice is on!");
            } else {
                btnVoice.innerText = "🔇 Voice Off";
                btnVoice.classList.add('muted');
            }
            e.currentTarget.blur();
        });

        // Map Keyboard Events to Tracking Dictionary
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Bind Peripheral Mobile Touch Targets Layout
        this.bindTouchControl('btn-up', 'up');
        this.bindTouchControl('btn-down', 'down');
        this.bindTouchControl('btn-left', 'left');
        this.bindTouchControl('btn-right', 'right');
    }

    bindTouchControl(elementId, direction) {
        const btn = document.getElementById(elementId);
        
        const startAction = (e) => {
            e.preventDefault();
            this.soundManager.init(); // Warm-start Audio Sandbox Context inside explicit user input listener loops
            this.touchDirections[direction] = true;
        };
        
        const endAction = (e) => {
            e.preventDefault();
            this.touchDirections[direction] = false;
        };

        btn.addEventListener('touchstart', startAction, { passive: false });
        btn.addEventListener('touchend', endAction, { passive: false });
        btn.addEventListener('mousedown', startAction);
        btn.addEventListener('mouseup', endAction);
        btn.addEventListener('mouseleave', endAction);
    }

    resizeCanvas() {
        // Enforce physical coordinate buffers based on rendering client wrapper context bounding geometry
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        
        if (this.player) {
            // Guarantee player isn't forced off grid viewport context bounds during dynamic orientation adjustments
            this.player.x = Math.max(30, Math.min(this.canvas.width - 30, this.player.x));
            this.player.y = Math.max(30, Math.min(this.canvas.height - 30, this.player.y));
        }
    }

    resetGameEntities() {
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.spawnPassenger();
        this.destination = null;
    }

    buildStaticWorldEnvironment() {
        this.scenery = [];
        const backgroundIcons = ['🌳', '🏡', '🌸', '🧱'];
        const mapArea = this.canvas.width * this.canvas.height;
        // Balance background element allocation density programmatically based on active coordinate matrices space
        const elementQuota = Math.floor(mapArea / 12000);

        for (let i = 0; i < elementQuota; i++) {
            this.scenery.push({
                x: Math.random() * (this.canvas.width - 60) + 30,
                y: Math.random() * (this.canvas.height - 60) + 30,
                icon: backgroundIcons[Math.floor(Math.random() * backgroundIcons.length)],
                scale: Math.random() * 0.3 + 0.8
            });
        }
    }

    spawnPassenger() {
        // Safe padding boundaries so children can access the targets instantly without border clipping
        const px = Math.random() * (this.canvas.width - 120) + 60;
        const py = Math.random() * (this.canvas.height - 120) + 60;
        this.passenger = new Passenger(px, py);
    }

    triggerToast(message) {
        const container = document.getElementById('game-toast');
        container.innerText = message;
        container.classList.remove('hidden');
        
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            container.classList.add('hidden');
        }, 1800);
    }

    checkCollision(rect1, entity2) {
        // AABB variant logic for robust processing of simplified circle coordinates boundaries overlap detection
        const distance = Math.sqrt(Math.pow(rect1.x - entity2.x, 2) + Math.pow(rect1.y - entity2.y, 2));
        return distance < (rect1.width / 2 + 20);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop);
    }

    update() {
        // Update vehicle vectors
        this.player.update(this.keys, this.touchDirections, this.canvas.width, this.canvas.height);

        // Process Passenger Intersect Logic
        if (this.passenger && this.checkCollision(this.player, this.passenger)) {
            this.soundManager.playPickup();
            this.triggerToast("Picked up! 🎉");
            
            // Map location and generate target node instance
            this.destination = new Destination(
                Math.random() * (this.canvas.width - 120) + 60,
                Math.random() * (this.canvas.height - 120) + 60
            );
            
            this.speechManager.speak(this.destination.target.speech);
            this.passenger = null;
        }

        // Process Destination Intersect Logic
        if (this.destination && this.checkCollision(this.player, this.destination)) {
            this.stars += 1;
            this.trips += 1;
            
            document.getElementById('star-count').innerText = this.stars;
            document.getElementById('trip-count').innerText = this.trips;

            // Generate floating visual reward items matrix
            for (let i = 0; i < 12; i++) {
                this.particles.push(new Particle(this.destination.x, this.destination.y, 'star'));
            }

            // Milestone system activation parameters check
            if (this.trips % 5 === 0) {
                this.soundManager.playMilestone();
                this.triggerToast("SUPER DRIVER! 🏆");
                this.speechManager.speak("Wow! You are a super driver!");
                
                // Explode massive full frame celebration matrix arrays
                for (let i = 0; i < 40; i++) {
                    this.particles.push(new Particle(this.canvas.width / 2, this.canvas.height / 3, 'confetti'));
                }
            } else {
                this.soundManager.playDropoff();
                this.triggerToast("Great Job! ⭐");
            }

            this.destination = null;
            this.spawnPassenger();
        }

        // Processing lifecycle state arrays loops
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Ambient Background Elements
        this.scenery.forEach(item => {
            this.ctx.save();
            this.ctx.font = `${Math.floor(28 * item.scale)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(item.icon, item.x, item.y);
            this.ctx.restore();
        });

        // Draw Interactive Game Loops Entities
        if (this.passenger) this.passenger.draw(this.ctx);
        if (this.destination) this.destination.draw(this.ctx);
        
        this.player.draw(this.ctx);

        // Draw Active Interactive Particle Elements Matrix Array
        this.particles.forEach(p => p.draw(this.ctx));
    }
}

// Initial Launch Sequence Initialization Trigger
window.addEventListener('load', () => {
    new Game();
});