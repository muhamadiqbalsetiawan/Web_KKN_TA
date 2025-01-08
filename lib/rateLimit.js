const idToRequestCount = new Map(); // keeps track of individual users
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 10 * 60 * 1000, // Milliseconds (60 = currently 1 Hour)
  maxRequests: 5,
};

export const rateLimit = (ip) => {
  // Check and update current window
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.set(ip, 0);
  }

  // Check and update current request limits
  const currentRequestCount = idToRequestCount.get(ip) || 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};