window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var global_width = window.innerWidth,
    global_height = window.innerHeight,
    ratio = 1,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    particles = [],
    mousePos = {x: 0, y: 0},
    listDistDivider = 10,
    pointScape = 2,
    pointCount = 100,
    pointColor = '#ECF0F1',
    lineColor = '#ECF0F1';

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
    draw();
}

function init() {
    resetParticles();
    draw();
}

function drawExample() {

    var lineDist = global_width / listDistDivider;

    particles.forEach(function (particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.scale, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = pointColor;
        ctx.fill();

        var mouseDistance = lineDistance(particle, mousePos);
        if (mouseDistance < lineDist) {
            drawLine(particle, mousePos, mouseDistance);
        }

        particles.forEach(function (particleTwo) {
            var distance = lineDistance(particle, particleTwo);
            if (distance < lineDist) {
                drawLine(particle, particleTwo, distance);
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
            var indexTwo = particles.indexOf(particle);
            if (indexTwo > -1) {
                particles.splice(indexTwo, 1);
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
    for (var i = 0; i < pointCount; i++) {
        addNewPoint();
    }
}

function drawLine(particle, particleTwo, distance) {
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particleTwo.x, particleTwo.y);
    ctx.lineWidth = distance / 300;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
}

function addNewPoint() {
    var dx = Math.random() - Math.random();
    var dy = Math.random() - Math.random();
    var speed = Math.random() + 1;

    var x = randomIntFromInterval(0, global_width);
    var y = randomIntFromInterval(0, global_height);
    var scale = pointScape;
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