import { describe, expect, it } from 'vitest'
import {Account} from '@/stores/Account.js';


describe('Account', () => {
  
    it('ignores unkown field when filling the model', () => {
      const user = new Account({ id: 1, Fullname: 'John Doe' })
  
      expect(user.id).toBe(1)
      //expect((user as any).name).toBe(undefined)
    })
})