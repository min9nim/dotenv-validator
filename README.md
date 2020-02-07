## dotenv-validator

You can validate environment variables defined in `.env` with `dotenv-validator`

<br>

## Prerequisite

1. [dotenv](https://www.npmjs.com/package/dotenv) installed
1. default value of environment variables is ready
1. validation rules of variables is optional

## Usage

your `.env`

```
host = 0.0.0.A
port = 3030
```

default value

```javascript
const envDefault = {
  host: '',
  port: '',
}
```

rules of .env

```javascript
const envRules = {
  host: {
    required: true, // default is true
    validator: value => /[\d]+\.[\d]+\.[\d]+\.[\d]+/.test(value),
  },
}
```

then, `validate` throw error

```javascript
try {
  validate({envDefault, envParsed, envRules})
} catch (e) {
  console.error(e) // print error `'host' is not valid in '.env'`
}
```
