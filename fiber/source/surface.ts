const PI2 = Math.PI * 2;

const beta = -5e-4;
const K = 4e-4;
// const g = new Vec3(0, 0, -1e-6);
const g = new Vec3();

class Point {
    pos: Vec3;
    vel: Vec3;
    fixed: boolean;

    constructor(pos: Vec3, fixed: boolean = false) {
        this.pos = pos;
        this.vel = new Vec3();
        this.fixed = fixed;
    }
}

class Edge {
    u: number;
    v: number;
    l: number;
    k: number;

    constructor(u: number, v: number, l: number, k: number) {
        this.u = u;
        this.v = v;
        this.l = l;
        this.k = k;
    }
}

class Surface {
    points: Point[];
    edges: Edge[];

    constructor(m: [number, number, number][]) {
        let o = -1, p = -1, q = 0;
        this.points = [];
        this.edges = [];
        for (let i = 0; i < m.length; i++) {
            let j = 0, j2 = 0;
            q = this.points.length;
            for (let k = 0; k < m[i][0]; k++) {
                const theta = PI2 * k / m[i][0];
                this.points.push(new Point(new Vec3(
                    m[i][1] * Math.cos(theta),
                    m[i][1] * Math.sin(theta),
                    m[i][2]
                ).add(randVec(0.02)), !i));
                this.edges.push(new Edge(q + k, q + (k + 1) % m[i][0], 1, K * 8));
                this.edges.push(new Edge(q + k, q + (k + 2) % m[i][0], 2, K));
                if (i) for (; j <= m[i - 1][0]; j++) {
                    this.edges.push(new Edge(p + j % m[i - 1][0], q + k, Math.hypot(1, j - k * m[i - 1][0] / m[i][0]), K * 8));
                    if (Math.abs((k + 1) * m[i - 1][0] - j * m[i][0]) < Math.abs(k * m[i - 1][0] - (j + 1) * m[i][0]))
                        break;
                }
                if (i >= 2) for (; j2 <= m[i - 2][0]; j2++) {
                    this.edges.push(new Edge(o + j2 % m[i - 2][0], q + k, Math.hypot(2, j2 - k * m[i - 2][0] / m[i][0]), K));
                    if (Math.abs((k + 1) * m[i - 2][0] - j2 * m[i][0]) < Math.abs(k * m[i - 2][0] - (j2 + 1) * m[i][0]))
                        break;
                }
            }
            if (i) for (; j < m[i - 1][0]; j++) {
                this.edges.push(new Edge(p + j, q, Math.hypot(1, m[i - 1][0] - j), K * 8));
                this.edges.push(new Edge(p + j, q, 1, K * 8));
            }
            if (i >= 2) for (; j2 < m[i - 2][0]; j2++) {
                this.edges.push(new Edge(o + j2, q, Math.hypot(2, m[i - 2][0] - j), K));
                this.edges.push(new Edge(o + j2, q, 1, K));
            }
            o = p;
            p = q;
        }
    }

    advance(dt: number = 1000 / 60): void {
        const gdt = g.mul(dt);
        for (const p of this.points)
            p.vel.mulEq(Math.exp(beta * dt)).addEq(gdt);
        for (const e of this.edges) {
            const ds = this.points[e.v].pos.sub(this.points[e.u].pos);
            const dv = ds.mul(e.k * (1 - e.l / ds.len()) * dt);
            this.points[e.u].vel.addEq(dv);
            this.points[e.v].vel.subEq(dv);
        }
        for (const p of this.points)
            if (!p.fixed)
                p.pos.addEq(p.vel.mul(dt));
    }
}
