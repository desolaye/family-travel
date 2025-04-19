import { CommandContext, Composer } from 'grammy'
import { BotContext } from '../../types'
import { envParams } from '../../env-params'

const balance = new Composer<BotContext>()

balance.command('balance', async (ctx: CommandContext<BotContext>) => {
  const user = ctx.session.user

  if (!user) return

  const daysLeft = Math.floor(user.balance / Number(envParams().DAILY_PAYMENT))

  await ctx.reply(
    'Ваш текущий баланс: `' + user.balance + '`\nДней осталось: ' + daysLeft,
    { parse_mode: 'MarkdownV2' }
  )
})

export { balance }
