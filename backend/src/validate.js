const VALID_LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English']

const validateApplication = (body) => {
  const { name, mobile, amount, purpose, language } = body

  const errors = []

  if (!name || name.trim().length < 2)
    errors.push('name must be at least 2 characters')

  if (!mobile || !/^\d{10}$/.test(mobile))
    errors.push('mobile must be exactly 10 digits')

  if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0)
    errors.push('amount must be a positive number')

  if (!purpose || purpose.trim().length < 3)
    errors.push('purpose must be at least 3 characters')

  if (!language || !VALID_LANGUAGES.includes(language))
    errors.push(`language must be one of: ${VALID_LANGUAGES.join(', ')}`)

  return errors
}

module.exports = validateApplication
