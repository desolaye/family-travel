import { Composer } from 'grammy'
import { BotContext } from '../../types'
import { getUserByTelegramId } from '../../database'

const help = new Composer<BotContext>()

help.command('help', async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return

  const user = await getUserByTelegramId(userId)

  let message =
    'Добро пожаловать в Family Travel по Амстердаму\n\n' +
    'Для гостей:\n' +
    '/key <PUBLIC_KEY> - Вход по ключу\n' +
    '/start - Стартовая информация\n\n' +
    'Для пользователей:\n\n' +
    '/balance - Стартовая информация\n' +
    '/pay - Информация по опате\n' +
    '/pay <AMOUNT> - Оплата за поездку\n'

  if (user?.isAdmin) {
    message +=
      '\nДля администраторов:\n' +
      '/add_key <PUBLIC_KEY> <IP_ADDRESS> - Добавить новый ключ\n' +
      '/approve <PAYMENT_ID> - Принять заявку\n' +
      '/reject <PAYMENT_ID> - Отклонить заявку\n' +
      '/list - Список всех пользователей\n' +
      '/inspect <USER_ID> - Информация о пользователе'
  }

  await ctx.reply(message)
})

export { help }
