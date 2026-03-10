const required = (key, fallback) => {
  const v = process.env[key] ?? fallback
  if (v === undefined || v === null || v === '') throw new Error(`Missing env var: ${key}`)
  return v
}

const optional = (key, fallback) => process.env[key] ?? fallback

module.exports = {
  required,
  optional,
}

