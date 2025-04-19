import { Composer } from 'grammy'

import { BotContext } from '../../types'

const start = new Composer<BotContext>()

start.command('start', async (ctx) => {
  await ctx.reply(
    'Привет\\! Я ваш бот по комфортному путешествию в Амстердам\n' +
      'Для начала работы используйте команду:\n' +
      '`/key \\<PUBLIC\\_KEY\\>`\n\n' +
      'где `PUBLIC\\_KEY` ваш публичный ключ \\(можно добавить несколько для всех ваших устройств\\)',
    { parse_mode: 'MarkdownV2' }
  )
})

export { start }
