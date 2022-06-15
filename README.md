## dotenv-validator

You can validate environment variables defined in `.env` with `dotenv-validator`

<br>

## Prerequisite

1. [dotenv](https://www.npmjs.com/package/dotenv) installed
1. default value of environment variables is ready
1. validation rules is ready

<br>

## Install

```
npm i dotenv-validator
```

<br>

## Usage

If your `.env` is like below (_with invalid host_)

```
host = 0.0.0.A
port = 3030
```

<br>

and your `default-env.js` is like below

```javascript
export const envDefault = {
  HOST: '',
  PORT: '',
}

export const envRules = {
  HOST: {
    required: true, // default is false
    validator: value => /\d+\.\d+\.\d+\.\d+/.test(value),
  },
}
```

<br>

then, `validate` throw error

```javascript
import {envDefault, envRules} from './default-env'
import dotenv from 'dotenv'
import validate from 'dotenv-validator'

try {
  // load .env
  const envParsed = dotenv.config().parsed

  // set default to process.env
  process.env = {...envDefault, ...process.env}

  // validate process.env
  validate({envDefault, envParsed, envRules}) // throw error if process.env is not valid
} catch (e) {
  console.error(e) // print error `'host' is not valid in '.env'`
}
```
