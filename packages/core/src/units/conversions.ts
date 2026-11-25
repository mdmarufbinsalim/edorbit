import { EARTH } from "./constants";

export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86_400;

export const metresToKilometres = (m: number): number => m / 1000;
export const kilometresToMetres = (km: number): number => km * 1000;
export const metresToEarthRadii = (m: number): number => m / EARTH.meanRadius;
export const earthRadiiToMetres = (re: number): number => re * EARTH.meanRadius;
export const secondsToHours = (s: number): number => s / SECONDS_PER_HOUR;
export const secondsToDays = (s: number): number => s / SECONDS_PER_DAY;
