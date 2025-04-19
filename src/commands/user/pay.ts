import { CommandContext, Composer, InlineKeyboard } from 'grammy'

import { createPayment, getAllUsers } from '../../database'
import { BotContext } from '../../types'
import { envParams } from '../../env-params'

const pay = new Composer<BotContext>()

pay.command('pay', async (ctx: CommandContext<BotContext>) => {
  const user = ctx.session.user
  if (!user) return

  const { DEPOSIT_MSG } = envParams()

  const [_, amountStr] = ctx.msg.text.split(' ')

  if (!amountStr) {
    await ctx.reply(DEPOSIT_MSG, { parse_mode: 'MarkdownV2' })
    return
  }

  const amount = parseInt(amountStr)

  if (isNaN(amount) || amount <= 0) {
    await ctx.reply('Пожалуйста, введите валидное число:' + '`/pay <СУММА_ПЛАТЕЖА>`', {
      parse_mode: 'MarkdownV2',
    })
    return
  }

  const payment = createPayment(user.id, amount)
  await ctx.reply(`Заявка на оплату суммой ${amount} создана. Ожидайте одобрения`)

  const admin = getAllUsers().find((u) => u.isAdmin)

  if (admin) {
    const inlineKeyboard = new InlineKeyboard()
      .text('Принять', `/approve ${payment.id}`)
      .text('Отменить', `/reject ${payment.id}`)

    await ctx.api.sendMessage(
      admin.telegramId,
      `Заявка на оплату от ${user.telegramId}\n` +
        `  Сумма: ${amount}\n` +
        `  ID заявки: ${payment.id}\n`,
      { reply_markup: inlineKeyboard }
    )
  }
})

export { pay }
