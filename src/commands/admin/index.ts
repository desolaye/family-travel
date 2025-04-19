import { Composer } from 'grammy'
import { BotContext } from '../../types'

import { addKey } from './add-key'
import { list } from './list'
import { inspect } from './inspect'
import { approve } from './approve'
import { reject } from './reject'

const adminComposer = new Composer<BotContext>()

adminComposer.use(addKey, list, inspect, approve, reject)

export { adminComposer }
