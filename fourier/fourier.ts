class Complex {
    re: number; im: number;

    constructor(re: number = 0, im: number = 0) {
        this.re = re;
        this.im = im;
    }

    copy(): Complex {
        return new Complex(this.re, this.im);
    }
    add(other: Complex): Complex {
        return new Complex(this.re + other.re, this.im + other.im)
    }
    addeq(other: Complex): Complex {
        this.re += other.re;
        this.im += other.im;
        return this;
    }
    sub(other: Complex): Complex {
        return new Complex(this.re - other.re, this.im - other.im)
    }
    mul(k: number | Complex): Complex {
        if (typeof k === "number")
            return new Complex(this.re * k, this.im * k);
        return new Complex(this.re * k.re - this.im * k.im, this.re * k.im + this.im * k.re);
    }
    muleq(k: number): Complex {
        this.re *= k;
        this.im *= k;
        return this;
    }
    div(k: number): Complex {
        return new Complex(this.re / k, this.im / k);
    }
    diveq(k: number): Complex {
        this.re /= k;
        this.im /= k;
        return this;
    }
    rot(turns: number): Complex {
        const theta = 2 * Math.PI * turns
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Complex(this.re * c - this.im * s, this.re * s + this.im * c);
    }

    len(): number {
        return Math.hypot(this.re, this.im);
    }
}

function rot(turns: number): Complex {
    const theta = 2 * Math.PI * turns;
    return new Complex(Math.cos(theta), Math.sin(theta));
}

class Point {
    t: number; p: Complex;

    constructor(p: Complex, t: number) {
        this.p = p.copy();
        this.t = t;
    }
}

class Graph {
    n: number; t: number;
    points: Point[];
    coeffs: Complex[];
    order: number[]

    constructor(n: number, t: number, points: Point[]) {
        this.n = n;
        this.t = t;
        this.points = points;
        this.coeffs = [];
        this.order = [];
        for (let f = -n; f <= n; f++) {
            this.coeffs.push(new Complex());
            if (!f)
                continue;
            this.order.push(f);
            for (let i = 0; i < this.points.length; i++) {
                const tprev = this.prog(i - 1);
                const tcurr = this.prog(i);
                const tnext = this.prog(i + 1);
                this.coeffs[n + f].addeq(this.points[i].p.mul(
                    rot(-f * tcurr).sub(rot(-f * tprev)).div(tcurr - tprev).sub(
                        rot(-f * tnext).sub(rot(-f * tcurr)).div(tnext - tcurr)
                    )
                ));
            }
            const w = 2 * Math.PI * f;
            this.coeffs[n + f].diveq(w * w);
        }
        for (let i = 0; i < this.points.length; i++) {
            this.coeffs[n].addeq(this.points[i].p.mul(this.prog(i + 1) - this.prog(i - 1)));
        }
        this.coeffs[this.n].diveq(2);
        this.order.sort((f1, f2) => this.coeffs[n + f2].len() - this.coeffs[n + f1].len());
    }
    prog(i: number): number {
        const leaps = Math.floor(i / this.points.length);
        return this.points[i - leaps * this.points.length].t / this.t + leaps;
    }
}

const n = 20;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const circles = document.getElementById("circles") as HTMLInputElement;
const num_circles = document.getElementById("num-circles") as HTMLParagraphElement;
const playback = document.getElementById("playback") as HTMLInputElement;
const num_playback = document.getElementById("num-playback") as HTMLParagraphElement;
const ctx = canvas.getContext("2d")!;

let c = 12;
let t0 = performance.now();
let prevt = performance.now();
let spd = 0.25;
let phase = 0;
let tc = 0;
let recording = false;
let points: Point[] = [];
let dist = 0;
let graph = new Graph(4, 2000, [new Point(new Complex(360, -360), 0)]);
let curve: Complex[] = [];

function parse_coords(e: PointerEvent): Complex {
    return new Complex(canvas.width * e.offsetX / canvas.offsetWidth, -canvas.height * e.offsetY / canvas.offsetHeight);
}

function handle_pointerdown(p: Complex) {
    if (recording)
        return;
    t0 = performance.now();
    points = [new Point(p, 0)];
    recording = true;
    dist = 0;
}

function handle_pointermove(p: Complex) {
    if (!recording)
        return;
    points.push(new Point(p, performance.now() - t0));
    dist += points.at(-1)!.p.sub(points.at(-2)!.p).len();
}

function handle_pointerup() {
    if (!recording)
        return;
    graph = new Graph(n, (performance.now() - t0) * (1 + points.at(-1)!.p.sub(points[0].p).len() / (2 * dist)), points);
    recording = false;
    phase = tc = 0;
    curve = [];
}

function draw_path() {
    if (!points.length)
        return;
    ctx.strokeStyle = "#0a0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(points[0].p.re, -points[0].p.im);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].p.re, -points[i].p.im);
    }
    ctx.closePath();
    ctx.stroke();
}

function render_fourier(t = phase) {
    let p = graph.coeffs[graph.n].copy();
    ctx.strokeStyle = "#fff";
    for (let i = 0; i < c && i < graph.order.length; i++) {
        const f = graph.order[i];
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.re, -p.im, graph.coeffs[graph.n + f].len(), 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.re, -p.im);
        p = p.add(graph.coeffs[graph.n + f].rot(f * t));
        ctx.lineTo(p.re, -p.im);
        ctx.stroke();
    }
    if (t - tc < 1)
        curve.push(p);
    if (!curve.length)
        return;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0ff";
    ctx.beginPath();
    ctx.moveTo(curve[0].re, -curve[0].im);
    for (let i = 1; i < curve.length; i++) {
        ctx.lineTo(curve[i].re, -curve[i].im);
    }
    if (t - tc >= 1)
        ctx.closePath();
    ctx.stroke();
}

function frame() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 720, 720);
    ctx.strokeStyle = "#fff";
    draw_path();
    phase += spd / graph.t * (performance.now() - prevt);
    prevt = performance.now();
    if (!recording)
        render_fourier();
    requestAnimationFrame(frame);
}

function init() {
    graph.coeffs = [
        new Complex(0, 100),
        new Complex(-60, -80),
        new Complex(),
        new Complex(),
        new Complex(360, -360),
        new Complex(),
        new Complex(),
        new Complex(-60, 80),
        new Complex(0, 100),
    ]
    graph.order = [-4, 3, -3, 4];
    ctx.fillStyle = "#000";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillRect(0, 0, 720, 720);
    canvas.addEventListener("pointerdown", e => handle_pointerdown(parse_coords(e)));
    canvas.addEventListener("pointermove", e => handle_pointermove(parse_coords(e)));
    addEventListener("mouseup", handle_pointerup);
    addEventListener("pointerup", handle_pointerup);
    addEventListener("pointercancel", handle_pointerup);
    addEventListener("touchend", handle_pointerup);
    addEventListener("touchcancel", handle_pointerup);
    circles.addEventListener("input", () => {
        num_circles.textContent = `${circles.value} circles`;
        c = Number.parseInt(circles.value);
        if (points.length) {
            curve = [];
            tc = phase;
        }
    });
    playback.addEventListener("input", () => {
        spd = Number.parseFloat(playback.value);
        num_playback.textContent = `Playback speed: ${spd}x`;
    })
    frame();
}

init();