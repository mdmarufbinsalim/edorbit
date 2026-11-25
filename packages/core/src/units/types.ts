/**
 * Physical quantities are plain numbers in SI units internally.
 * These aliases document intent at API boundaries; they do not enforce it.
 */
export type Metres = number;
export type Seconds = number;
export type Kilograms = number;
export type MetresPerSecond = number;
export type MetresPerSecondSquared = number;
export type Newtons = number;
export type Joules = number;
export type JoulesPerKilogram = number;
/** Standard gravitational parameter μ = GM, in m³/s². */
export type GravitationalParameter = number;
