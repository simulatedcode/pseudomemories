import * as THREE from "three";

/**
 * Convert Right Ascension (hours) and Declination (degrees) to 3D Cartesian coordinates.
 * @param ra RA in hours (0-24)
 * @param dec Dec in degrees (-90 to 90)
 * @param radius Sphere radius
 */
export function raDecToXYZ(ra: number, dec: number, radius: number = 1): THREE.Vector3 {
    const phi = (90 - dec) * (Math.PI / 180);
    const theta = (ra * 15) * (Math.PI / 180); // 15 degrees per hour

    return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

/**
 * Calculate Local Sidereal Time (LST) in degrees.
 * Simplified formula for visualization.
 */
export function getLST(longitude: number, date: Date = new Date()): number {
    const jd = (date.getTime() / 86400000) + 2440587.5; // Julian Date
    const d = jd - 2451545.0; // Days from J2000.0

    // GMST in degrees
    let gmst = 280.46061837 + 360.98564736629 * d;
    gmst = gmst % 360;
    if (gmst < 0) gmst += 360;

    const lst = (gmst + longitude) % 360;
    return lst < 0 ? lst + 360 : lst;
}
