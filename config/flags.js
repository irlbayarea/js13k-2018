// Can use this to conditionally set different flags in production mode.
const PRODUCTION = process.env.NODE_ENV == 'production';

/**
 * Usable in the client code by referencing FLAGS_<name>.
 *
 * See ../src/common/flags.d.ts
 */
const flags = {
  PRODUCTION: PRODUCTION,
  VERSION: '0.1.0',
};

module.exports = (flags => {
  const results = {};
  for (const key of Object.keys(flags)) {
    results[`FLAGS_${key}`] = JSON.stringify(flags[key]);
  }
  console.log('Building with flags', flags);
  return results;
})(flags);
