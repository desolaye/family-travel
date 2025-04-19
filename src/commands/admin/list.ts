import { Composer } from 'grammy'
import { BotContext } from '../../types'
import { getAllUsers } from '../../database'

const list = new Composer<BotContext>()

list.command('list', async (ctx) => {
  const users = getAllUsers()
  let message = 'All users:\n\n'

  users.forEach((user) => {
    if (user.isAdmin) return
    message += `ID: ${user.telegramId}\n` + `Баланс: ${user.balance}\n\n`
  })

  await ctx.reply(message)
})

export { list }
