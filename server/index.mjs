import express from 'express';
import morgan from 'morgan';
import homeworkRouter from './routes/homework_routes.mjs';
import userRouter from './routes/user_routes.mjs';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import   LocalStrategy  from 'passport-local';

import { getUserByUsernameAndPassword, getUserById } from './dao/user_dao.mjs';


const app = express();
const port = 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));



passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await getUserByUsernameAndPassword(username, password);
      if (!user) return done(null, false, { message: 'Username o password errati.' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await getUserById(id);
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/api', homeworkRouter);
app.use('/api', userRouter);

// LOGIN
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json({ 
    id: req.user.id, 
    name: req.user.name, 
    role: req.user.role 
  });
});


// SESSIONE CORRENTE
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      id: req.user.id, 
      name: req.user.name, 
      role: req.user.role 
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// LOGOUT
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});