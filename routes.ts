// 👇 some jsdoc comments

/**
 * An array of routes that are accessible to the public
 * These routes are not protected by the authentication middleware
 * @type {string[]}
 */
export const publicRoutes = ['/'];
/**
 * An array of routes that are accessible to authenticated users
 * These routes are protected by the authentication middleware
 * @type {string[]}
 */

export const privateRoutes = ['/settings', '/client', '/server'];

// auth routes
/**
 * An array of routes that are used for authentication
 * These routes are not protected by the authentication middleware
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register'];
/**
 * The prefix for the api  authentication routes
 * @type {string}
 * @default /api/auth
 */

export const apiPrefix = '/api/auth';

// admin routes

/**
 * An array of routes that are accessible to authenticated users and admins
 * These routes are protected by the authentication middleware
 * @type {string[]}
 */
export const adminRoutes = ['/admin'];

/**
 * this is the default route authenticated users are redirected to when they login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
