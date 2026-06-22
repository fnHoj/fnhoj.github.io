"use strict";
function gaussian(sigma = 1, steps = 0x10) {
    let s = -steps / 2;
    for (let i = 0; i < steps; i++)
        s += Math.random();
    return s * sigma * Math.sqrt(12 / steps);
}
class Vec2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vec2(this.x, this.y);
    }
    len2() {
        return this.x * this.x + this.y * this.y;
    }
    len() {
        return Math.sqrt(this.len2());
    }
    neg() {
        return new Vec2(-this.x, -this.y);
    }
    plus(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    minus(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    times(k) {
        return new Vec2(this.x * k, this.y * k);
    }
    div(k) {
        return new Vec2(this.x / k, this.y / k);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    plus_eq(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    minus_eq(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    times_eq(k) {
        this.x *= k;
        this.y *= k;
        return this;
    }
    div_eq(k) {
        this.x /= k;
        this.y /= k;
        return this;
    }
    mirrorX() {
        this.x = -this.x;
        return this;
    }
    mirrorY() {
        this.y = -this.y;
        return this;
    }
}
function randVec(sigma = 1, steps = 0x10) {
    return new Vec2(gaussian(sigma, steps), gaussian(sigma, steps));
}
function polarVec(theta = 0, rho = 1) {
    return new Vec2(rho * Math.cos(theta), rho * Math.sin(theta));
}
