window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var particles = [];
var mousePos = {x: 0, y: 0};

var global_width = window.innerWidth,
    global_height = window.innerHeight,
    ratio = 1,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

/* SETUP */
function setup() {
    if (ctx) {
        canvas.addEventListener('mousemove', function (evt) {
            mousePos = getMousePos(canvas, evt);
        }, false);
        init();
        requestAnimationFrame(update);
        window.addEventListener('resize', rescale);
        rescale();
    }
}

function rescale() {
    global_width = window.innerWidth;
    global_height = window.innerHeight;
    if (ctx.webkitBackingStorePixelRatio < 2) ratio = window.devicePixelRatio || 1;
    canvas.setAttribute('width', global_width * ratio);
    canvas.setAttribute('height', global_height * ratio);
//    resetParticles();
    draw();
}

/* INIT */
function init() {

    resetParticles();
    draw();
}


/* DRAW */
function drawExample() {

    var lineDist = global_width / 10;

    particles.forEach(function (particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.scale, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#ECF0F1';
        ctx.fill();

        var mouseDistance = lineDistance(particle, mousePos);
        if (mouseDistance < lineDist) {
            drawLine(particle, mousePos, mouseDistance);
        }

        particles.forEach(function (particleTwo) {
            var distance = lineDistance(particle, particleTwo);
            if (distance < lineDist) {
                drawLine(particle,particleTwo,distance);
            }
        });

        if (particle.x > global_width || particle.x < 0) {
            var index = particles.indexOf(particle);
            if (index > -1) {
                particles.splice(index, 1);
                addNewPoint();
            }
        }
        if (particle.y > global_height || particle.y < 0) {
            var index = particles.indexOf(particle);
            if (index > -1) {
                particles.splice(index, 1);
                addNewPoint();
            }
        }

        particle.x += (particle.dx * particle.speed);
        particle.y += (particle.dy * particle.speed);

    });
}


function draw() {
    ctx.save();
    ctx.scale(ratio, ratio);
    // Execute your draw specific functions between the lines to enable high-dpi drawing
    // ---------------------------------------------------------------------------------
    ctx.clearRect(0, 0, global_width, global_height);
    drawExample();
    // ---------------------------------------------------------------------------------
    ctx.restore();
}

/* UPDATE */
function update() {
    requestAnimationFrame(update);
    draw();
}

////////////////////

function lineDistance(point1, point2) {
    var xs = point2.x - point1.x;
    xs = xs * xs;

    var ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

function resetParticles() {
    particles = [];
    for (var i = 0; i < 100; i++) {
        addNewPoint();
    }
}

function drawLine(particle, particleTwo, distance){
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particleTwo.x, particleTwo.y);
    ctx.lineWidth = distance / 300;
    ctx.strokeStyle = '#ECF0F1';
    ctx.stroke();
}

function addNewPoint() {
    var dx = Math.random() - Math.random();
    var dy = Math.random() - Math.random();
    var speed = Math.random() + 1;

    var x = randomIntFromInterval(0, global_width);
    var y = randomIntFromInterval(0, global_height);
    var scale = 2;
    particles.push({x: x, y: y, dx: dx, dy: dy, scale: scale, speed: speed});
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}