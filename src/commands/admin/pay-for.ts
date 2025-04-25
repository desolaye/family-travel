import { Api, Composer } from 'grammy'

import { getUserByTelegramId, updateUserBalance } from '../../database'
import { BotContext } from '../../types'
import { envParams } from '../../env-params'

const payFor = new Composer<BotContext>()

payFor.command('pay_for', async (ctx) => {
  const [_, telegramId, amount] = ctx.msg.text.split(' ')
  const { BOT_TOKEN } = envParams()
  const api = new Api(BOT_TOKEN)

  if (!telegramId || !amount) {
    await ctx.reply('Неверная команда: ' + '`/pay_for <TG_ID> <AMOUNT>`', {
      parse_mode: 'MarkdownV2',
    })
    return
  }

  const user = await getUserByTelegramId(Number(telegramId))
  if (!user) return

  const newBalance = user.balance + Number(amount)

  updateUserBalance(user.id, parseFloat(newBalance.toFixed(2)))

  await api.sendMessage(
    user.chatId,
    `Ваш текущий баланс был обновлен и теперь составляет: ${parseFloat(
      newBalance.toFixed(2)
    )}`
  )

  await ctx.reply(
    `Баланс пользователя ${user.id} обновлен. И теперь составляет ${parseFloat(
      newBalance.toFixed(2)
    )}`
  )
})

export { payFor }
