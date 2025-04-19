import { Composer } from 'grammy'

import { BotContext } from '../../types'

import {
  assignKeyToUser,
  createUser,
  getAccessKey,
  getUserByTelegramId,
} from '../../database'

const userRegister = new Composer<BotContext>()

userRegister.command('key', async (ctx) => {
  const userId = ctx.from?.id

  if (!userId) return

  const [_, key] = ctx.msg.text.split(' ')

  if (!key) {
    await ctx.reply('Предоставьте ключ в формате:\n' + '`/key <PUBLIC_KEY>`', {
      parse_mode: 'MarkdownV2',
    })

    return
  }

  const accessKey = getAccessKey(key)

  if (!accessKey || accessKey.isUsed) {
    await ctx.reply('Неверный ключ')
    return
  }

  let user = await getUserByTelegramId(userId)

  if (!user) {
    user = createUser(userId, ctx.chat.id)
    await ctx.reply('Аккаунт зарегистрирован!')
  }

  assignKeyToUser(key, user.id)

  await ctx.reply(
    'Ключ успешно добавлен!\n' + 'Для списка доступных команд используйте `/help`',
    { parse_mode: 'MarkdownV2' }
  )
})

export { userRegister }
