module.exports = ({ value }) => ({
  valid:
    (typeof value === 'string' || typeof value === 'number') &&
    /^\+?[\d\s()]+$/.test(value)
});
