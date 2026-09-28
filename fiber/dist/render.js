"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let t = performance.now();
// let s = new Surface(new Array(8).fill(null).map((_, i) => {i++; return [i * 4, i * (2/3), i * Math.sqrt(5)/3];}));
// let s = new Surface(new Array(8).fill(null).map((_, i) => {i++; return [i * 4, i, 0];}));
// let s = new Surface(new Array(12).fill(null).map((_, i) => {i++; return [i * 6, i, 0];}));
let s = new Surface(new Array(20).fill(null).map((_, i) => { const a = 0.15; i++; return [Math.round(PI2 * Math.sinh(a * i) / a), i, 0]; }));
let dist = 30;
let fl = 600;
let theta = 0;
let phi = 2.2;
function renderSurface() {
    const p = s.points.map(p => p.pos.rotZ(theta).rotX(phi).proj(dist, fl));
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    for (const e of s.edges) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + p[e.u].x, canvas.height / 2 + p[e.u].y);
        ctx.lineTo(canvas.width / 2 + p[e.v].x, canvas.height / 2 + p[e.v].y);
        ctx.stroke();
    }
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderSurface();
}
function frame() {
    requestAnimationFrame(frame);
    const t1 = performance.now();
    s.advance(t1 - t);
    t = t1;
    render();
}
const km = 0.005;
let down = false, mx = 0, my = 0;
canvas.addEventListener("pointerdown", e => {
    mx = e.screenX;
    my = e.screenY;
    down = true;
});
addEventListener("pointermove", e => {
    if (down) {
        theta += km * (e.screenX - mx);
        theta %= PI2;
        phi += km * (e.screenY - my);
        if (phi <= 0)
            phi = 0;
        else if (phi >= Math.PI)
            phi = Math.PI;
    }
    mx = e.screenX;
    my = e.screenY;
});
addEventListener("pointerup", () => down = false);
frame();
