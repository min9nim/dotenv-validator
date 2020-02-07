## dotenv-validator

You can validate environment variables defined in `.env` with `dotenv-validator`

<br>

## Prerequisite

1. [dotenv](https://www.npmjs.com/package/dotenv) installed
1. default value of environment variables is ready
1. validation rules is ready

<br>

## Usage

your `.env` _with invalid host_

```
host = 0.0.0.A
port = 3030
```

<br>

and your `default-env.ts` is like below

```javascript
export const envDefault = {
  host: '',
  port: '',
}

export const envRules = {
  host: {
    required: true, // default is true
    validator: value => /[\d]+\.[\d]+\.[\d]+\.[\d]+/.test(value),
  },
}
```

<br>

then, `validate` throw error

```javascript
import {envDefault, envRules} from './default-env.ts'
import dotenv from 'dotenv'

try {
  // load .env
  const envParsed = dotenv.config().parsed

  // set default to process.env
  process.env = {...envDefault, ...process.env}

  // validate process.env
  validate({envDefault, envParsed, envRules})
} catch (e) {
  console.error(e) // print error `'host' is not valid in '.env'`
}
```
