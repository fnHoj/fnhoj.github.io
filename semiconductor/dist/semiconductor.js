"use strict";
const PI2 = Math.PI * 2;
const R = 1;
const R_COLLIDE = 0.02;
const R2_COLLIDE = R_COLLIDE * R_COLLIDE * 4;
const mu = 4e-6;
const rho = 192;
let D = 0;
function dist2(a, b) {
    const dx = a.x - b.x;
    let dy = (a.y - b.y) % 1;
    if (dy > 0.5)
        dy--;
    else if (dy < -0.5)
        dy++;
    return dx * dx + dy * dy;
}
function repel(source, dist) {
    const dx = PI2 * (source.x - dist.x);
    const dy = PI2 * (source.y - dist.y);
    return new Vec2(Math.sinh(dx), Math.sin(dy))
        .div(Math.cosh(dx) - Math.cos(dy));
}
class Particle {
    pos;
    neg;
    constructor(pos, neg = false) {
        this.pos = pos.copy();
        this.neg = neg;
    }
}
const particles = [];
function voltage() {
    let v = -rho * R * R;
    for (const p of particles) {
        if (p.neg)
            v += p.pos.x;
        else
            v -= p.pos.x;
    }
    return 2 * v;
}
function motion(dt = 1000 / 60) {
    for (let i = 0; i < particles.length; i++) {
        const E = new Vec2(-2 * Math.max(0, rho * (R - Math.abs(particles[i].pos.x))));
        for (let j = 0; j < particles.length; j++) {
            if (j === i)
                continue;
            if (particles[j].neg)
                E.plus_eq(repel(particles[j].pos, particles[i].pos));
            else
                E.minus_eq(repel(particles[j].pos, particles[i].pos));
        }
        E.times_eq(mu * dt);
        if (particles[i].neg)
            particles[i].pos.minus_eq(E);
        else
            particles[i].pos.plus_eq(E);
        particles[i].pos.plus_eq(randVec(D * Math.sqrt(dt)));
        if ((particles[i].pos.y %= 1) < 0)
            particles[i].pos.y++;
    }
    for (let i = 0; i < particles.length; i++) {
        for (let j = 1; j < particles.length; j++) {
            if (particles[i].neg === particles[j].neg)
                continue;
            if (dist2(particles[i].pos, particles[j].pos) < R2_COLLIDE) {
                particles.splice(j, 1);
                particles.splice(i, 1);
                i--;
                break;
            }
        }
    }
}
function init() {
    for (let i = 0; i < rho * R * 0.8; i++) {
        particles.push(new Particle(new Vec2(R * Math.random(), Math.random()), true));
        particles.push(new Particle(new Vec2(-R * Math.random(), Math.random()), false));
    }
}
