module.exports = ({ value }) => ({
  valid: typeof value === 'number' && !Number.isNaN(value)
});
