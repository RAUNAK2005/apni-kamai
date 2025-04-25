require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Temporary in-memory user storage
const users = new Map();

// Always add our default user
users.set('raunak', {
  username: 'raunak',
  password: '2000',
  email: 'raunak@example.com'
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET || 'apni-kamai-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Not Loaded');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
};

// Pass session data to all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
app.get('/', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.get('/home', isAuthenticated, (req, res) => res.render('index', { activePage: 'home' }));
app.get('/calculators', isAuthenticated, (req, res) => res.render('calculators', { activePage: 'calculators' }));
app.get('/dashboard', isAuthenticated, (req, res) => res.render('dashboard', { activePage: 'dashboard' }));
app.get('/loan-calculator', isAuthenticated, (req, res) => res.render('loan-calculator', { activePage: 'calculators' }));
app.get('/sip-calculator', isAuthenticated, (req, res) => res.render('sip-calculator', { activePage: 'calculators' }));
app.get('/mf-calculator', isAuthenticated, (req, res) => res.render('mf-calculator', { activePage: 'calculators' }));
app.get('/fd-calculator', isAuthenticated, (req, res) => res.render('fd-calculator', { activePage: 'calculators' }));
app.get('/rd-calculator', isAuthenticated, (req, res) => res.render('rd-calculator', { activePage: 'calculators' }));
app.get('/ppf-calculator', isAuthenticated, (req, res) => res.render('ppf-calculator', { activePage: 'calculators' }));
app.get('/tax-calculator', isAuthenticated, (req, res) => res.render('tax-calculator', { activePage: 'calculators' }));
app.get('/retirement-calculator', isAuthenticated, (req, res) => res.render('retirement-calculator', { activePage: 'calculators' }));
app.get('/inflation-calculator', isAuthenticated, (req, res) => res.render('inflation-calculator', { activePage: 'calculators' }));
app.get('/compound-interest-calculator', isAuthenticated, (req, res) => res.render('compound-interest-calculator', { activePage: 'calculators' }));
app.get('/guidance', isAuthenticated, (req, res) => res.render('guidance', { activePage: 'guidance' }));
app.get('/signup', (req, res) => res.render('signup', { error: null, activePage: 'signup' }));
app.get('/login', (req, res) => res.render('login', { error: null, activePage: 'login' }));

app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  console.log('User signup:', { username, password, email });
  
  // Validate that all required fields are provided
  if (!username || !password || !email) {
    return res.render('signup', { error: 'All fields are required', activePage: 'signup' });
  }
  
  // Check if username already exists
  if (users.has(username)) {
    return res.render('signup', { error: 'Username already exists', activePage: 'signup' });
  }
  
  // Store user in our temporary Map
  users.set(username, { username, password, email });
  console.log('User registered successfully:', username);
  console.log('Current users:', [...users.keys()]);
  
  // Redirect to login page after successful signup
  res.redirect('/login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });
  
  // Check if user exists and password matches
  const user = users.get(username);
  if (user && user.password === password) {
    // Set session as authenticated
    req.session.isAuthenticated = true;
    req.session.username = username;
    
    // Redirect to home page
    res.redirect('/home');
  } else {
    // Show error message
    res.render('login', { error: 'Invalid username or password. Please try again.', activePage: 'login' });
  }
});

app.get('/logout', (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

// Rancho AI Endpoint
app.post('/rancho', async (req, res) => {
  const { message } = req.body;
  console.log('Rancho received message:', message);

  if (!message) {
    console.log('No message provided');
    return res.json({ reply: 'Rancho here! Please ask me something.' });
  }

  try {
    console.log('Calling Gemini API...');
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are Rancho, a friendly and knowledgeable finance assistant for Apni Kamai. Provide helpful, concise, and accurate financial advice. User message: ${message}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    const reply = result.response.text().trim();
    console.log('Rancho reply:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('Rancho Error:', error.message);
    res.json({ reply: 'Rancho here! Oops, something went wrong. Try again?' });
  }
});

app.listen(port, () => console.log(`Apni Kamai running at http://localhost:${port}`));