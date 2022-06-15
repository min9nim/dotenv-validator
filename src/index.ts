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
  envParsed?: IEnv
  envDefault: any // IEnv 대신 그냥 any 사용;) https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type
  envRules?: IEnvRules
  logPassedMsg?: boolean
}
export default function validate({
  envParsed = {},
  envDefault,
  envRules,
  logPassedMsg,
}: IValidateInput) {
  const env: IEnv = {...envDefault, ...envParsed} // envParsed 는 설정된 값이 언제나 스트링임이 보장된다
  // check default
  Object.keys(envParsed).forEach(key => {
    if (!envDefault.hasOwnProperty(key)) {
      throw Error(`${key}'s defaultValue is not found`)
    }
  })

  // check required
  if (envRules) {
    Object.keys(envRules).forEach(key => {
      if (envRules[key].required !== true) {
        // 명시적으로 required 를 false 로 세팅한 경우만 필수값 체크를 하지 않는다.
        // 해당 설정 값의 룰을 등록하지 않은 경우 해당 값은 기본적으로 필수 값이 된다.
        return
      } else {
        if (!env[key]) {
          throw Error(`'${key}' is required in .env`)
        }
      }
    })
  }

  // check validator
  if (envRules) {
    Object.entries(env).forEach(([key, value]) => {
      if (!envRules[key]) {
        // 룰 자체를 등록하지 않은 경우 skip
        return
      }
      const validator = envRules[key].validator
      if (!validator) {
        // validator 등록을 하지 않은 경우 skip
        return
      }
      const result = validator(value)
      if (result === false) {
        throw Error(`'${key}' is not valid in .env`)
      }
      if (result.valid === false) {
        throw Error(result.message)
      }
    })
  }

  if (logPassedMsg !== false) {
    console.log('`.env` validation passed')
  }
}
