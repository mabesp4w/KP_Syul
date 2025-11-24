import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function SearchBox({
    placeholder = 'Cari...',
    defaultValue = '',
    onSearch,
    debounceMs = 500,
    className = '',
    showIcon = true,
    route = null,
    routeParams = {},
    preserveState = true,
    replace = true,
    ...props
}) {
    const { url } = usePage();
    const [searchValue, setSearchValue] = useState(defaultValue);
    const debounceTimer = useRef(null);
    const isInitialMount = useRef(true);
    const routeParamsRef = useRef(routeParams);
    const pendingSearchRef = useRef(null);
    const lastUrlRef = useRef('');

    // Update routeParams ref whenever it changes
    useEffect(() => {
        routeParamsRef.current = routeParams;
    }, [routeParams]);

    // Sync searchValue with URL - check both usePage().url and window.location
    useEffect(() => {
        if (route) {
            const checkUrl = () => {
                try {
                    // Read directly from window.location to get the actual URL (works even with preserveState)
                    const currentUrl = window.location.href;
                    const urlObj = new URL(currentUrl);
                    const urlSearchParam = urlObj.searchParams.get('search') || '';
                    
                    // Only update if URL actually changed and search param is different
                    if (currentUrl !== lastUrlRef.current) {
                        lastUrlRef.current = currentUrl;
                        
                        // Only update if URL search param is different from current searchValue
                        // and we haven't just processed this value (to avoid loops)
                        if (urlSearchParam !== searchValue && urlSearchParam !== pendingSearchRef.current) {
                            setSearchValue(urlSearchParam);
                        }
                        
                        // Also update routeParamsRef with current URL params (except search)
                        const currentParams = {};
                        urlObj.searchParams.forEach((value, key) => {
                            if (key !== 'search') {
                                currentParams[key] = value;
                            }
                        });
                        routeParamsRef.current = { ...currentParams, ...routeParams };
                    }
                } catch (e) {
                    // Fallback to defaultValue if URL parsing fails
                    if (defaultValue !== searchValue && defaultValue !== pendingSearchRef.current) {
                        setSearchValue(defaultValue);
                    }
                }
            };
            
            // Check immediately
            checkUrl();
            
            // Also check on URL change from usePage
            if (url !== lastUrlRef.current) {
                checkUrl();
            }
        } else if (defaultValue !== searchValue && defaultValue !== pendingSearchRef.current) {
            setSearchValue(defaultValue);
        }
    }, [url, defaultValue, route, routeParams]);

    useEffect(() => {
        // Skip debounce on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer
        debounceTimer.current = setTimeout(() => {
            const currentSearchValue = searchValue;
            pendingSearchRef.current = currentSearchValue;
            
            if (onSearch) {
                // Custom onSearch callback
                onSearch(currentSearchValue);
                // Reset pendingSearchRef after a short delay to allow URL sync
                setTimeout(() => {
                    if (pendingSearchRef.current === currentSearchValue) {
                        pendingSearchRef.current = null;
                    }
                }, 100);
            } else if (route) {
                // Read all current query params from URL to preserve them
                let currentQueryParams = {};
                try {
                    const urlObj = new URL(window.location.href);
                    // Get all query params except 'search' (we'll set that separately)
                    urlObj.searchParams.forEach((value, key) => {
                        if (key !== 'search') {
                            currentQueryParams[key] = value;
                        }
                    });
                } catch (e) {
                    // If URL parsing fails, use empty object
                    currentQueryParams = {};
                }
                
                // Merge: routeParams prop (from filters) takes precedence over URL params
                // This ensures that filters from backend are always used
                const finalParams = {
                    ...currentQueryParams,
                    ...routeParamsRef.current, // This comes from routeParams prop (filters)
                    search: currentSearchValue, // Always use the new search value
                };
                
                // Remove null/undefined/empty string values (except search)
                Object.keys(finalParams).forEach((key) => {
                    if (key !== 'search' && (finalParams[key] === null || finalParams[key] === undefined || finalParams[key] === '')) {
                        delete finalParams[key];
                    }
                });
                
                const syncUrlAfterRequest = () => {
                    // After request finishes, read URL and sync searchValue
                    try {
                        const urlObj = new URL(window.location.href);
                        const urlSearchParam = urlObj.searchParams.get('search') || '';
                        lastUrlRef.current = window.location.href;
                        
                        // Update searchValue if URL has different value
                        if (urlSearchParam !== currentSearchValue) {
                            setSearchValue(urlSearchParam);
                        }
                        
                        // Reset pendingSearchRef after a short delay
                        setTimeout(() => {
                            if (pendingSearchRef.current === currentSearchValue) {
                                pendingSearchRef.current = null;
                            }
                        }, 50);
                    } catch (e) {
                        // Reset pendingSearchRef on error
                        pendingSearchRef.current = null;
                    }
                };
                
                router.get(
                    route,
                    finalParams,
                    {
                        preserveState,
                        replace,
                        onSuccess: syncUrlAfterRequest,
                        onFinish: syncUrlAfterRequest,
                    }
                );
            }
        }, debounceMs);

        // Cleanup function
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        // Reset pendingSearchRef when user types to allow URL sync
        pendingSearchRef.current = null;
        setSearchValue(newValue);
    };

    const handleClear = () => {
        setSearchValue('');
    };

    return (
        <div className={`form-control w-full ${className}`.trim()}>
            <div className="join w-full">
                {showIcon && (
                    <div className="join-item bg-base-200 flex items-center justify-center px-3 border border-base-300 border-r-0 rounded-l-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-base-content/70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                )}
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`input input-bordered join-item flex-1 ${!showIcon ? 'rounded-l-lg' : ''} ${!searchValue ? 'rounded-r-lg' : ''}`}
                    value={searchValue}
                    onChange={handleChange}
                    {...props}
                />
                {searchValue && (
                    <button
                        type="button"
                        className="btn btn-square join-item rounded-r-lg"
                        onClick={handleClear}
                        title="Hapus pencarian"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

