import { Composer } from 'grammy'

import { BotContext } from '../../types'
import { envParams } from '../../env-params'
import { createUser, getUserByTelegramId } from '../../database'

const adminRegister = new Composer<BotContext>()

adminRegister.command('travel_admin', async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return

  const [_, adminKey] = ctx.msg.text.split(' ')

  if (!adminKey) {
    await ctx.reply('Неверно введена команда:\n' + '`/travel_admin <PUBLIC_KEY>`', {
      parse_mode: 'MarkdownV2',
    })
    return
  }

  if (adminKey !== envParams().ADMIN_KEY) {
    await ctx.reply('Неверный ключ администратора')
    return
  }

  let user = await getUserByTelegramId(userId)

  if (!user) {
    createUser(userId, ctx.chat.id, true)
  } else if (!user.isAdmin) {
    await ctx.reply('Неверный ключ администратора')
    return
  }

  await ctx.reply('Поздравляю, вы стали администратором бота!')
})

export { adminRegister }
