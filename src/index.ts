export type IEnvValidator = (value: string) => any

export type ValidatorResult = boolean | IValidatorDetail

export interface IValidatorDetail {
  valid: boolean
  message?: string
}

export interface IEnvRule {
  required?: boolean
  validator?: IEnvValidator
}

export interface IEnvRules {
  [key: string]: IEnvRule
}

export interface IEnv {
  [key: string]: string
}

export interface IValidateInput {
  envParsed: IEnv
  envDefault: IEnv
  envRules?: IEnvRules
  logPassedMsg?: boolean
}
export default function validate({envParsed, envDefault, envRules, logPassedMsg}: IValidateInput) {
  if (!envParsed) {
    throw Error('envParsed is empty')
  }
  const env = {...envDefault, ...envParsed}
  // check default
  Object.keys(envParsed).forEach(key => {
    if (!envDefault.hasOwnProperty(key)) {
      throw Error(`${key}'s defaultValue is not found`)
    }
  })

  // check required
  for (const key in envDefault) {
    if (!envDefault.hasOwnProperty(key)) {
      continue
    }
    if (envRules && envRules[key] && !envRules[key].required) {
      // 명시적으로 required 를 false 로 세팅한 경우만 필수값 체크를 하지 않는다.
      // 해당 설정 값의 룰을 등록하지 않은 경우 해당 값은 기본적으로 필수 값이 된다.
      continue
    }
    if (!env[key]) {
      throw Error(`'${key}' is required in .env`)
    }
  }

  // check validator
  if (envRules) {
    for (const key in envParsed) {
      if (!envParsed.hasOwnProperty(key)) {
        continue
      }
      if (!envRules[key]) {
        // 룰 자체를 등록하지 않은 경우 skip
        continue
      }
      const validator = envRules[key].validator
      if (!validator) {
        // validator 등록을 하지 않은 경우 skip
        continue
      }
      const result = validator(envParsed[key])
      if (result === false) {
        throw Error(`'${key}' is not valid in '.env'`)
      }
      if (result.valid === false) {
        throw Error(result.message)
      }
    }
  }

  if (logPassedMsg !== false) {
    console.log('`.env` validation passed')
  }
}
