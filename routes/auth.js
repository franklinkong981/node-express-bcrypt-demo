/** Routes for demonstrating authentication in Express. */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

router.get('/', (req, res, next) => {
  res.send("APP IS WORKING!!!");
});

router.post('/register', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    //save to db
    const results = await db.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING username`,
      [username, hashedPassword]);
    return res.json(results.rows[0]);
  } catch(e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400));
    }
    return next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      //body is missing either username attribute, password attribute, or both.
      throw new ExpressError("Username and password required", 400);
    }
    const results = await db.query(
      `SELECT username, password
      FROM users
      WHERE username = $1`,
      [username]);
    const user = results.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return res.json({message: 'Logged in!'});
      } else {
        return res.json({message: 'Password does NOT match! Try again.'});
      }
    }
    //the user with the inputted username wasn't found.
    throw new ExpressError("Username not found!", 400);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;