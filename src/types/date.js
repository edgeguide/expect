module.exports = ({ value }) => ({
  valid:
    (value instanceof Date || typeof value === 'string') &&
    new Date(value).toString() !== 'Invalid Date'
});
