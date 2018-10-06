import jwt from 'jwt-simple';
import dotenv from 'dotenv';

import ClubUser from '../models/clubUserModel';

dotenv.config({ silent: true });

export const signIn = (req, res, next) => {
  res.send({ token: tokenForUser(req.user), username: req.user.username });
};

export const signUp = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(422).json({ error: 'You must provide email and password' });
    return;
  }

  ClubUser.findOne({ username, email })
    .then((result) => {
      if (result) {
        if (result.username === username) {
          res.status(422).json({ error: 'An account with this username already exists' });
        } else if (result.email === email) {
          res.status(422).json({ error: 'An account with this email already exists' });
        } else {
          res.status(422).json({ error: 'An account with this information already exists' });
        }
      } else {
        const user = new ClubUser();
        user.username = username;
        user.email = email;
        user.password = password;
        user.save()
          .then((response) => {
            res.send({ token: tokenForUser(user), username });
          });
      }
    });
};

export const validateNewField = (req, res, next) => {
  const { field, value } = req.query;
  const query = {};
  query[field] = value;
  ClubUser.findOne(query)
    .then((result) => {
      if (result) {
        res.json({ valid: false });
      } else {
        res.json({ valid: true });
      }
    });
};

export const validateNewUsername = (req, res, next) => {
  const { username } = req.body;
  ClubUser.findOne({ username })
    .then((result) => {
      if (result) {
        res.json({ exists: true });
      }
      res.json({ exists: true });
    });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
