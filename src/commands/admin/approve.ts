import { Composer } from 'grammy'

import { BotContext } from '../../types'
import {
  getAllUsers,
  getPaymentById,
  updatePaymentStatus,
  updateUserBalance,
} from '../../database'

const approve = new Composer<BotContext>()

approve.command('approve', async (ctx) => {
  const [_, paymentIdStr] = ctx.msg.text.split(' ')
  const paymentId = parseInt(paymentIdStr)
  if (isNaN(paymentId)) {
    await ctx.reply('Please provide a valid payment ID: /approve <PAYMENT_ID>')
    return
  }

  updatePaymentStatus(paymentId, 'approved')

  const payment = await getPaymentById(paymentId)

  if (!payment) {
    await ctx.reply(`Счёта с ID ${paymentId} не обнаружено`)
    return
  }

  updateUserBalance(payment.userId, payment.amount)

  const user = getAllUsers().find((v) => v.id === payment.userId)

  if (!user) {
    await ctx.reply('Пользователь не найден')
    return
  }

  await ctx.reply(`Оплата ${paymentId} одобрена. Баланс пользователя обновлен.`)

  await ctx.api.sendMessage(
    user.chatId,
    `Ваша сумма ${payment.amount} была подтверждена. Ваш новый баланс: ${user.balance}`
  )
})

export { approve }
