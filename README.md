# generate-graphql-app

[![Build Status](https://travis-ci.org/tomyitav/generate-graphql-app.svg?branch=master)](https://travis-ci.org/tomyitav/generate-graphql-app)
[![Coverage Status](https://coveralls.io/repos/github/tomyitav/generate-graphql-app/badge.svg?branch=master)](https://coveralls.io/github/tomyitav/generate-graphql-app?branch=master)
[![npm](https://img.shields.io/npm/v/generate-graphql-app.svg)](https://www.npmjs.com/package/generate-graphql-app)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![renovate-app badge][renovate-badge]][renovate-app]

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

Cli tool for bootstrapping production grade GraphQL server, using:

+ typescript
+ apollo-server 2
+ [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator)
+ merge-graphql-schemas
+ Dependency injection with `injection-js`

## Installation

Please make sure you have Node.js version 8+, and type

```npm install -g generate-graphql-app```

## CLI commands

### Init server command

Open shell in the desired folder for bootstrapping the server, and typed:

```gga init <project-name>```

The command will prompt available server seeds options. Choose the boilerplate project
you want, and start coding! 

### Generate server resolver files

The server boilerplate code is designed as multi file schema definitions.
Our recommended way for schema design is to create a type file for certain entity.
Eventually, all entities schemas are merged.
To generate a matching resolver file for type file, execute the command: 

```gga r <type-file> <resolver file>```

This will create a matching file, with all Query, Mutation and Subscription
definitions.

### Generate services

Our server resolvers should operate as a thin layer, or controller, that links between the schema, 
and the server business logic. We use *services* for our model, to perform logic such as api fetching,
db operations, etc. In order to create a new service, run the command:

```gga s <service-path> [--ignoreContext]```

This will create a new service file to services directory. Also, it will register the service on the
server *injector* file, and will add its definition to the context object, thus allowing its usage
by resolvers.
You can exclude context file additions by passing the *ignoreContext* flag. 

### Deploy server to production

Inside the project directory, type: 

```gga d```

This will run the server *deploy* script, and will move the server to production! :rocket:

### Extended documentation

Please check out the [extended documentation](https://tomyitav.github.io/generate-graphql-app) for more information
