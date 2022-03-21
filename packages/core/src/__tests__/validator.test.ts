import { validateConfig } from '@/validator'

describe('Validation', () => {
  describe('validateConfig', () => {
    describe('when valid `target`', () => {
      const config = { target: ['Promise.all'] }
      it('success', () => {
        expect(validateConfig(config)).toStrictEqual({ result: true, message: null })
      })
    })

    describe('when invalid `target`', () => {
      const config = { target: ['await Promise.all'] }
      it('failure', () => {
        expect(validateConfig(config)).toStrictEqual(
          {result: false, message: "[ddc] Invalid config.target: 'await Promise.all'. Cannot contain whitespace."})
      })
    })
  })
})
