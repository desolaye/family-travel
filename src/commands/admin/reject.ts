import { Composer } from 'grammy'
import { BotContext } from '../../types'
import { getPaymentById, updatePaymentStatus } from '../../database'

const reject = new Composer<BotContext>()

reject.command('reject', async (ctx) => {
  const [_, paymentIdStr] = ctx.msg.text.split(' ')
  const paymentId = parseInt(paymentIdStr)
  if (isNaN(paymentId)) {
    await ctx.reply('Please provide a valid payment ID: /reject <PAYMENT_ID>')
    return
  }

  updatePaymentStatus(paymentId, 'rejected')

  const payment = await getPaymentById(paymentId)

  if (!payment) {
    await ctx.reply(`Счёта с ID ${paymentId} не обнаружено`)
    return
  }

  await ctx.reply(`Payment ${paymentId} rejected.`)
  await ctx.api.sendMessage(payment.userId, `Ваша сумма ${payment.amount} была отклонена`)
})

export { reject }
