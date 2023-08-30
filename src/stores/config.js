import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createORM } from 'pinia-orm'

const pinia = createPinia()
pinia.use(createORM())
pinia.use(createPersistedState({
    auto: true,
    storage: localStorage
  }))


export default pinia