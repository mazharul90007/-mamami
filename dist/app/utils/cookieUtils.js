"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromCookie = exports.clearAuthCookies = exports.setAuthCookies = void 0;
const setAuthCookies = (res, accessToken, refreshToken) => {
    // Set access token cookie (short-lived, httpOnly, secure)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day (matches JWT expiry)
        path: '/',
    });
    // Set refresh token cookie (longer-lived, httpOnly, secure)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiry)
        path: '/',
    });
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
};
exports.clearAuthCookies = clearAuthCookies;
const getTokenFromCookie = (req, tokenType) => {
    const cookieName = tokenType === 'access' ? 'accessToken' : 'refreshToken';
    return req.cookies[cookieName] || null;
};
exports.getTokenFromCookie = getTokenFromCookie;
