import { Composer } from 'grammy'
import { BotContext } from '../../types'
import { getUserByTelegramId, getUserKeys } from '../../database'

const inspect = new Composer<BotContext>()

inspect.command('inspect', async (ctx) => {
  const [_, userIdStr] = ctx.msg.text.split(' ')
  const userId = parseInt(userIdStr)
  if (isNaN(userId)) {
    await ctx.reply('Предоставьте валидное ID: /inspect <USER_ID>')
    return
  }

  const user = await getUserByTelegramId(userId)

  if (!user) {
    await ctx.reply('Такого пользователя не существует')
    return
  }

  const keys = getUserKeys(user.id)

  let message =
    `ID: ${user.telegramId}\n` +
    `Баланс: ${user.balance}\n\n` +
    `Ключи (${keys.length}):\n`

  keys.forEach((key) => {
    message += `- ${key.key}\n`
  })

  await ctx.reply(message)
})

export { inspect }
