function gaussian(s = 1, n = 16) {
    let x = 0;
    for (let i = 0; i < n; i++) {
        x += Math.random();
    }
    return (2 * x - n) * s * Math.sqrt(3 / n);
}

class Vec2 {
    x: number; y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    len(): number {
        return Math.hypot(this.x, this.y);
    }
    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }
    neg(): Vec2 {
        return new Vec2(-this.x, -this.y);
    }
    unit(): Vec2 {
        return this.div(this.len());
    }
    add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    sub(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    mul(k: number): Vec2 {
        return new Vec2(this.x * k, this.y * k);
    }
    div(k: number): Vec2 {
        return new Vec2(this.x / k, this.y / k);
    }
}

class Vec3 {
    x: number; y: number; z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    len(): number {
        return Math.hypot(this.x, this.y, this.z);
    }
    copy(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }
    neg(): Vec3 {
        return new Vec3(-this.x, -this.y, -this.z);
    }
    add(other: Vec3): Vec3 {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    addEq(other: Vec3): Vec3 {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    sub(other: Vec3): Vec3 {
        return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    subEq(other: Vec3): Vec3 {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    mul(k: number): Vec3 {
        return new Vec3(this.x * k, this.y * k, this.z * k);
    }
    mulEq(k: number): Vec3 {
        this.x *= k;
        this.y *= k;
        this.z *= k;
        return this;
    }
    div(k: number): Vec3 {
        return new Vec3(this.x / k, this.y / k, this.z / k);
    }
    rotZ(theta: number): Vec3 {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Vec3(this.x * c - this.y * s, this.y * c + this.x * s, this.z);
    }
    rotX(theta: number): Vec3 {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Vec3(this.x, this.y * c - this.z * s, this.z * c + this.y * s);
    }
    proj(dist: number, fl: number): Vec2 {
        const z = this.z + dist;
        return new Vec2(fl * this.x / z, fl * this.y / z);
    }
}

function randVec(s: number = 1, n: number = 16) {
    return new Vec3(gaussian(s, n), gaussian(s, n), gaussian(s, n));
}

// class Mat3 {
//     xx: number; xy: number; xz: number;
//     yx: number; yy: number; yz: number;
//     zx: number; zy: number; zz: number;

//     constructor(
//             xx: number = 1, xy: number = 0, xz: number = 0,
//             yx: number = 0, yy: number = 1, yz: number = 0,
//             zx: number = 0, zy: number = 0, zz: number = 1) {
//         this.xx = xx; this.xy = xy; this.xz = xz;
//         this.yx = yx; this.yy = yy; this.yz = yz;
//         this.zx = zx; this.zy = zy; this.zz = zz;
//     }

//     copy(): Mat3 {
//         return new Mat3(
//             this.xx, this.xy, this.xz,
//             this.yx, this.yy, this.yz,
//             this.zx, this.zy, this.zz
//         );
//     }
//     neg(): Mat3 {
//         return new Mat3(
//             -this.xx, -this.xy, -this.xz,
//             -this.yx, -this.yy, -this.yz,
//             -this.zx, -this.zy, -this.zz
//         );
//     }
//     add(other: Mat3): Mat3 {
//         return new Mat3(
//             this.xx + other.xx, this.xy + other.xy, this.xz + other.xz,
//             this.yx + other.yx, this.yy + other.yy, this.yz + other.yz,
//             this.zx + other.zx, this.zy + other.zy, this.zz + other.zz
//         );
//     }
//     sub(other: Mat3): Mat3 {
//         return new Mat3(
//             this.xx - other.xx, this.xy - other.xy, this.xz - other.xz,
//             this.yx - other.yx, this.yy - other.yy, this.yz - other.yz,
//             this.zx - other.zx, this.zy - other.zy, this.zz - other.zz
//         );
//     }
//     mul(other: number | Mat3): Mat3;
//     mul(other: Vec3): Vec3;
//     mul(other: number | Vec3 | Mat3): Mat3 | Vec3 {
//         if (other instanceof Vec3)
//             return new Vec3(
//                 this.xx * other.x + this.xy * other.y + this.xz * other.z,
//                 this.yx * other.x + this.yy * other.y + this.yz * other.z,
//                 this.zx * other.x + this.zy * other.y + this.zz * other.z
//             );
//         else if (other instanceof Mat3)
//             return new Mat3(
//                 this.xx * other.xx + this.xy * other.yx + this.xz * other.zx,
//                 this.xx * other.xy + this.xy * other.yy + this.xz * other.zy,
//                 this.xx * other.xz + this.xy * other.yz + this.xz * other.zz,

//                 this.yx * other.xx + this.yy * other.yx + this.yz * other.zx,
//                 this.yx * other.xy + this.yy * other.yy + this.yz * other.zy,
//                 this.yx * other.xz + this.yy * other.yz + this.yz * other.zz,

//                 this.zx * other.xx + this.zy * other.yx + this.zz * other.zx,
//                 this.zx * other.xy + this.zy * other.yy + this.zz * other.zy,
//                 this.zx * other.xz + this.zy * other.yz + this.zz * other.zz
//             );
//         else
//             return new Mat3(
//                 this.xx * other, this.xy * other, this.xz * other,
//                 this.yx * other, this.yy * other, this.yz * other,
//                 this.zx * other, this.zy * other, this.zz * other
//             );
//     }
//     div(other: number): Mat3 {
//         return new Mat3(
//             this.xx / other, this.xy / other, this.xz / other,
//             this.yx / other, this.yy / other, this.yz / other,
//             this.zx / other, this.zy / other, this.zz / other
//         );
//     }
// }
