// Simple logger middleware — logs method, path, time, and query/body summary
    module.exports = function logger(req, res, next) {
    const now = new Date().toISOString();
    const method = req.method;
    const path = req.originalUrl;
    const query = Object.keys(req.query).length ? JSON.stringify(req.query) : '-';
    const body = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '-';
    console.log(`[${now}] ${method} ${path} | query=${query} | body=${body}`);
    next();
};