import { CommandContext, Composer } from 'grammy'

import { BotContext } from '../../types'
import { removeUserKey } from '../../database'

const removeKey = new Composer<BotContext>()

removeKey.command('remove_key', async (ctx: CommandContext<BotContext>) => {
  const user = ctx.session.user
  if (!user) return

  const [_, key] = ctx.msg.text.split(' ')

  if (!key) {
    await ctx.reply('Пожалуйста, предоставьте ключ:' + '`/remove_key <PUBLIC_KEY>`', {
      parse_mode: 'MarkdownV2',
    })
    return
  }

  const success = removeUserKey(user.id, key)

  await ctx.reply(
    success
      ? 'Ключ успешно удален из вашего аккаунта'
      : 'Ключ не найден или не связан с вашим аккаунтом'
  )
})

export { removeKey }
