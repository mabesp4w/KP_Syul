// Bootstrap file for Laravel Breeze
// This file is required by app.jsx

import * as routes from './routes';

// Setup route helper function for Wayfinder
const routeHelper = (name, params = {}) => {
    const routeFunction = routes[name];
    
    if (!routeFunction) {
        console.error(`Route [${name}] not found.`);
        return '#';
    }
    
    // If routeFunction has a url method, call it
    if (typeof routeFunction.url === 'function') {
        return routeFunction.url(params);
    }
    
    // Otherwise, call the function directly
    if (typeof routeFunction === 'function') {
        const result = routeFunction(params);
        return result?.url || '#';
    }
    
    return '#';
};

// Add current method to route helper
routeHelper.current = (name) => {
    const currentPath = window.location.pathname;
    const routeFunction = routes[name];
    
    if (!routeFunction || !routeFunction.url) {
        return false;
    }
    
    const routeUrl = routeFunction.url();
    return currentPath === routeUrl || currentPath.startsWith(routeUrl + '/');
};

// Make route helper available globally
window.route = routeHelper;

