"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const voltage_input = document.getElementById("voltage");
const temperature_input = document.getElementById("temperature");
const height = 300;
const half_width = height * R;
const width = 2 * half_width;
const nv = 64;
const kv = 0.002;
let V = 0;
function render() {
    if (V > 0)
        document.body.classList.add("forward");
    else
        document.body.classList.remove("forward");
    if (V < 0)
        document.body.classList.add("reverse");
    else
        document.body.classList.remove("reverse");
    canvas.width = width;
    canvas.height = height * 2;
    ctx.fillStyle = "#4f4f4f";
    ctx.fillRect(0, 0, half_width, height);
    ctx.fillStyle = "#b0b0b0";
    ctx.fillRect(half_width, 0, half_width, height);
    for (const p of particles) {
        ctx.fillStyle = p.neg ? "#000" : "#fff";
        ctx.beginPath();
        ctx.arc(height * (p.pos.x + R), height * p.pos.y, height * R_COLLIDE, 0, PI2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(height * (p.pos.x + R), height * (p.pos.y - 1), height * R_COLLIDE, 0, PI2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(height * (p.pos.x + R), height * (p.pos.y + 1), height * R_COLLIDE, 0, PI2);
        ctx.fill();
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, height, width, height);
    ctx.fillStyle = "#444";
    ctx.fillRect(0, height * 1.5 - 1, width, 2);
    ctx.fillRect(0, height * (1.5 - kv * 0.5 * V) - 1, half_width, 2);
    ctx.fillRect(half_width - 1, height, 2, height);
    ctx.fillRect(half_width, height * (1.5 + kv * 0.5 * V) + 1, half_width, 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-1000, height * 1.5);
    for (let i = -nv; i <= nv; i++) {
        const x = R * i / nv;
        let v = -rho * (x < 0 ? R * R - (x + R) ** 2 : (R - x) ** 2 - R * R);
        for (const p of particles) {
            if (p.neg)
                v += Math.abs(x - p.pos.x);
            else
                v -= Math.abs(x - p.pos.x);
        }
        ctx.lineTo(half_width + height * x, height * (1.5 - kv * v));
    }
    ctx.stroke();
}
let t = performance.now();
function frame() {
    motion();
    while (voltage() > V + 2 * R) {
        particles.push(new Particle(new Vec2(-R, Math.random()), true));
        particles.push(new Particle(new Vec2(R, Math.random()), false));
    }
    while (voltage() < V - 2 * R) {
        particles.push(new Particle(new Vec2(R, Math.random()), true));
        particles.push(new Particle(new Vec2(-R, Math.random()), false));
    }
    render();
    requestAnimationFrame(frame);
}
voltage_input.addEventListener("input", () => {
    V = Number.parseFloat(voltage_input.value);
});
temperature_input.addEventListener("input", () => {
    D = Number.parseFloat(temperature_input.value);
});
init();
frame();
