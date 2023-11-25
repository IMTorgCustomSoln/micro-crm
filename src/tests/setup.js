import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, vi } from 'vitest'
//import { Vue2, createApp, install, isVue2 } from 'vue-demi'

import { createApp } from '@vue/compat';
import { Model, createORM, useRepo } from 'pinia-orm'

/*
vi.mock('nanoid/non-secure', () => ({
    customAlphabet: vi.fn(),
    nanoid: vi.fn()
  }))

vi.mock('data/data.json', () => {
    return {
      default: mocks.default,
    };
  });*/



beforeEach(() => {
  const app = createApp({})
  const pinia = createPinia()
  pinia.use(createORM())
  app.use(pinia)
  setActivePinia(pinia)
  Model.clearBootedModels()
  useRepo(Model).hydratedDataCache.clear()
})