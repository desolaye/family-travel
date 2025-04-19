import { Composer } from 'grammy'

import { createAccessKey } from '../../database'
import { BotContext } from '../../types'

const addKey = new Composer<BotContext>()

addKey.command('add_key', async (ctx) => {
  const [_, key, ipAddress] = ctx.msg.text.split(' ')

  if (!key) {
    await ctx.reply('Неверная команда: ' + '`/add_key <HASHED_KEY> <IP_ADDRESS>`', {
      parse_mode: 'MarkdownV2',
    })
    return
  }

  createAccessKey(key, ipAddress)

  const IPString = ipAddress ? ` с IP \`${ipAddress}\`` : ''

  await ctx.reply(`Ключ \`${key}\` успешно добавлен${IPString}.`, {
    parse_mode: 'MarkdownV2',
  })
})

export { addKey }
