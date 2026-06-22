function gaussian(sigma: number = 1, steps: number = 0x10): number {
    let s = -steps / 2;
    for (let i = 0; i < steps; i++)
        s += Math.random();
    return s * sigma * Math.sqrt(12 / steps);
}

class Vec2 {
    x: number; y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    len2(): number {
        return this.x * this.x + this.y * this.y;
    }
    len(): number {
        return Math.sqrt(this.len2());
    }

    neg(): Vec2 {
        return new Vec2(-this.x, -this.y);
    }
    plus(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    minus(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    times(k: number): Vec2 {
        return new Vec2(this.x * k, this.y * k);
    }
    div(k: number): Vec2 {
        return new Vec2(this.x / k, this.y / k);
    }
    dot(other: Vec2): number {
        return this.x * other.x + this.y * other.y;
    }

    negate(): Vec2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    plus_eq(other: Vec2): Vec2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    minus_eq(other: Vec2): Vec2 {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    times_eq(k: number): Vec2 {
        this.x *= k;
        this.y *= k;
        return this;
    }
    div_eq(k: number): Vec2 {
        this.x /= k;
        this.y /= k;
        return this;
    }
    mirrorX(): Vec2 {
        this.x = -this.x;
        return this;
    }
    mirrorY(): Vec2 {
        this.y = -this.y;
        return this;
    }
}

function randVec(sigma: number = 1, steps: number = 0x10): Vec2 {
    return new Vec2(gaussian(sigma, steps), gaussian(sigma, steps));
}

function polarVec(theta: number = 0, rho: number = 1): Vec2 {
    return new Vec2(rho * Math.cos(theta), rho * Math.sin(theta));
}