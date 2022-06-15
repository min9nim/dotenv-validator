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
HOST=0.0.0.A
PORT=3030
```

<br>

then, `validate` throw error

```javascript
import dotenv from 'dotenv'
import validate from 'dotenv-validator'

try {
  const envDefault = {
    HOST: '',
    PORT: '',
  }

  const envRules = {
    HOST: {
      required: true, // default is false
      validator: value => /\d+\.\d+\.\d+\.\d+/.test(value),
    },
  }

  // load .env
  const envParsed = dotenv.config().parsed

  // set default to process.env
  process.env = {...envDefault, ...process.env}

  // validate process.env
  validate({envDefault, envParsed, envRules}) // throw error if process.env is not valid
} catch (e) {
  console.error(e) // print error `'HOST' is required in .env`
}
```
