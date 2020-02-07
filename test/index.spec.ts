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
      expect(`'host' is not valid in '.env'`).to.be.equal(e.message)
    }
  })
  it('should be failed when parsed value is not found envDefault', () => {
    const envParsed = {
      host: '0.0.0.0',
    }
    try {
      validate({envDefault, envParsed, envRules})
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
      validate({envDefault, envParsed, envRules})
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
      expect(true).to.be.equal(false)
    } catch (e) {
      expect(e.message).to.be.equal(`'protocol' is required in .env`)
    }
  })
})
