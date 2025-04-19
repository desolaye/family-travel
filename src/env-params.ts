export const envParams = () => {
  if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not defined in .env')
  }

  if (!process.env.ADMIN_KEY) {
    throw new Error('ADMIN_KEY is not defined in .env')
  }

  if (!process.env.DAILY_PAYMENT) {
    throw new Error('DAILY_PAYMENT is not defined in .env')
  }

  if (!process.env.DEPOSIT_MSG) {
    throw new Error('DEPOSIT_MSG is not defined in .env')
  }

  return {
    BOT_TOKEN: process.env.BOT_TOKEN,
    ADMIN_KEY: process.env.ADMIN_KEY,
    DAILY_PAYMENT: process.env.DAILY_PAYMENT,
    DEPOSIT_MSG: process.env.DEPOSIT_MSG,
  }
}
