import { validateConfig } from '@/validator'

describe('Validation', () => {
  describe('validateConfig', () => {
    describe('when valid `target`', () => {
      const config = {
        matches: {
          test: {
            pattern: ['Promise.all', 'map', 'Task.create']
          }
        }
      }
      it('success', () => {
        expect(validateConfig(config)).toStrictEqual({ test: { result: true, message: null }})
      })
    })

    describe('when invalid `target`', () => {
      const config = {
        matches: {
          test: {
            pattern: ["await Promise.all", "map", "Task.create"],
          },
        },
      };
      it('failure', () => {
        expect(validateConfig(config)).toStrictEqual(
          { test: { result: false, message: "[ddc] Invalid config.matches[test].pattern: '[await Promise.all, map, Task.create]'. Cannot contain whitespace." } })
      })
    })
  })
})
