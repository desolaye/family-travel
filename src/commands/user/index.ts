import { Composer } from 'grammy'
import { BotContext } from '../../types'

import { pay } from './pay'
import { balance } from './balance'
import { removeKey } from './remove-key'
import { help } from './help'

const userComposer = new Composer<BotContext>()

userComposer.use(help, pay, balance, removeKey)

export { userComposer }
