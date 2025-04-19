import { Composer } from 'grammy'

import { BotContext } from '../../types'

import { userRegister } from './user-register'
import { adminRegister } from './admin-register'
import { start } from './start'

const guestComposer = new Composer<BotContext>()

guestComposer.use(start, userRegister, adminRegister)

export { guestComposer }
