const express = require('express');
const cors = require('cors');
const path = require('path');
const expressSession = require('express-session');

const app = express();
const http = require('http').createServer(app);

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});
// Express App Config
app.use(express.json());
app.use(session);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: [
            'http://localhost:8081',
            'http://127.0.0.1:8081',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3030',
            'http://127.0.0.1:3030',
            'http://localhost:3031',
            'http://127.0.0.1:3031',
            'http://localhost:3000',
            'http://127.0.0.1:3000',

        ],
        credentials: true,
    };
    app.use(cors(corsOptions));
}

const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const contactRoutes = require('./api/contact/contact.routes');
const { connectSockets } = require('./services/socket.service');

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware');
app.all('*', setupAsyncLocalStorage);

// TODO: check with app.use
app.get('/api/setup-session', (req, res) => {
    req.session.connectedAt = Date.now()
    console.log('setup-sesiion:', req.sessionID);
    res.end()
})

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);
connectSockets(http, session);
// connectSockets(http, session,corsOptions.origin);

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});
