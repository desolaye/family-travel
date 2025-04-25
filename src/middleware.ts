import { NextFunction } from 'grammy'

import { getUserByTelegramId } from './database'
import { BotContext } from './types'

export async function authMiddleware(ctx: BotContext, next: NextFunction) {
  const userId = ctx.from?.id
  ctx.session ??= { user: null }

  if (!userId) {
    await ctx.reply('Только в личных сообщениях')
    return
  }

  const user = await getUserByTelegramId(userId)
  ctx.session.user = user ?? null

  const skipAuthCommands = ['/travel_admin', '/key', '/start']

  if (skipAuthCommands.some((cmd) => ctx.msg?.text?.startsWith(cmd))) {
    await next()
    return
  }

  ctx.session.user = (await getUserByTelegramId(userId)) ?? null

  if (!ctx.session.user) {
    await ctx.reply(
      'Сперва нужно войти в аккаунт\\. Используйте команду `/key <PUBLIC_KEY>`',
      { parse_mode: 'MarkdownV2' }
    )
    return
  }

  const adminCommands = [
    '/add_key',
    '/approve',
    'reject',
    '/inspect',
    '/list',
    '/pay_for',
  ]

  if (adminCommands.some((cmd) => ctx.msg?.text?.startsWith(cmd))) {
    const { isAdmin } = ctx.session.user || {}

    if (!isAdmin) return
  }

  await next()
}
