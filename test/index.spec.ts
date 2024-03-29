import validate from '../src'
import {expect} from 'chai'

describe('dotenv-validator', () => {
  const envDefault = {
    host: '',
    port: '',
  }
  const envParsed = {
    host: '0.0.0.0',
    port: '3030',
  }
  const envRules = {
    host: {
      validator: value => /\d+\.\d+\.\d+\.\d+/.test(value),
    },
  }
  it('should be passed with valid value', () => {
    validate({envDefault, envParsed, envRules, logPassedMsg: false})
    expect(true).to.be.equal(true)
  })
  it('should be failed with invalid value', () => {
    const envParsed = {
      host: '0.0.0.a',
      port: '3030',
    }
    try {
      validate({envDefault, envParsed, envRules})
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(`'host' is not valid in .env`).to.be.equal(e.message)
    }
  })
  it('should be failed when parsed value is not found envDefault', () => {
    const envParsed = {
      host: '0.0.0.0',
    }
    try {
      validate({
        envDefault,
        envParsed,
        envRules: {
          port: {
            required: true,
          },
        },
      })
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(e.message).to.be.equal(`'port' is required in .env`)
    }
  })
  it('should be failed when required value is not found .env', () => {
    const envDefault = {
      host: '',
      port: '',
      protocol: '',
    }
    try {
      validate({
        envDefault,
        envParsed,
        envRules: {
          protocol: {
            required: true,
          },
        },
      })
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(e.message).to.be.equal(`'protocol' is required in .env`)
    }
  })
  it('should be failed when envRules is undefined & required value is not found .env', () => {
    const envDefault = {
      host: '',
      port: '',
      protocol: '',
    }
    try {
      validate({envDefault, envParsed})
      expect(true).to.be.equal(true)
    } catch (e) {
      expect(true).to.be.equal(false)
    }
  })
  it('should be thrown error when value is undefined', () => {
    const envParsed = {}
    const envDefault = {
      protocol: '',
    }
    const envRules = {
      protocol: {
        validator: value => {
          return value === 'https' || value === 'http'
        },
      },
    }
    try {
      validate({envDefault, envParsed, envRules})
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(e.message).to.be.equal(`'protocol' is not valid in .env`)
    }
  })
  it('should be thrown error when value is not valid', () => {
    const envParsed = {}
    const envDefault = {
      protocol: '',
    }
    const envRules = {
      protocol: {
        required: false,
        validator: value => {
          return value === 'https' || value === 'http'
        },
      },
    }
    try {
      validate({envDefault, envParsed, envRules})
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(e.message).to.be.equal(`'protocol' is not valid in .env`)
    }
  })
  it('should be used empty object when envParsed is undefined', () => {
    const envParsed = undefined
    const envDefault = {
      protocol: '',
    }
    const envRules = {}
    try {
      validate({envDefault, envParsed, envRules})
      expect(true).to.be.equal(true)
    } catch (e) {
      expect(true).to.be.equal(false)
    }
  })

  it('should be failed when envRules item is not found .env', () => {
    const envParsed = undefined
    const envDefault = {
      protocol: 'xx',
    }
    const envRules = {
      host: {
        required: true,
      },
    }
    try {
      validate({envDefault, envParsed, envRules})
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(e.message).to.be.equal(`'host' is required in .env`)
    }
  })

  it('should be failed when envRules item is not found .env', () => {
    const envParsed = undefined
    const envDefault = {
      protocol: 'xx',
    }
    const envRules = {
      host: {
        required: false,
      },
    }
    try {
      validate({envDefault, envParsed, envRules})
      expect(true).to.be.equal(true)
    } catch (e) {
      expect(true).to.be.equal(false)
    }
  })
})
