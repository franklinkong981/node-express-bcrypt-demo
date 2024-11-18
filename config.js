/** Common settings for auth-api app. */

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgres://franklinkong981:123456789@127.0.0.1:5432/express_auth_test" 
  : "postgres://franklinkong981:123456789@127.0.0.1:5432/express_auth";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};