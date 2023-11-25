import { describe, expect, it, beforeEach } from 'vitest'
import { Model } from 'pinia-orm'

import { Lifecycle, LifecycleStep  } from '@/stores/Lifecycle'
import { defaultSteps } from '@/assets/defaults.js'


describe('Lifecycle and Steps', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  
    it('ignores unkown field when filling the model', () => {
        const lifecycleSteps = []
        for(const step of defaultSteps){
            const newStep = new LifecycleStep({
                id: step.id,
                Name: step.Name,
                DurationBizDays: step.DurationBizDays,
                Order: step.Order,
                Placeholder: step.Placeholder, 
                EmailForm: step.EmailForm
            })
            lifecycleSteps.push(newStep)
          }
        const lifecycle = new Lifecycle({
            id: "TJBQwoU9w3tOmYmEF_7cy",
            Name: "default",
            LifecycleStep: lifecycleSteps
        })
  
      expect(lifecycle.id).toBe("TJBQwoU9w3tOmYmEF_7cy")
      //expect((user as any).name).toBe(undefined)
    })
})
