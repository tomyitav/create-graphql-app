# generate-graphql-app

[![Build Status](https://travis-ci.org/tomyitav/generate-graphql-app.svg?branch=master)](https://travis-ci.org/tomyitav/generate-graphql-app)
[![npm](https://img.shields.io/npm/v/generate-graphql-app.svg)](https://www.npmjs.com/package/generate-graphql-app)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Cli tool for bootstrapping production grade GraphQL server, using:

+ typescript
+ apollo-server 2
+ [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator)
+ merge-graphql-schemas
+ Dependency injection with `injection-js`

## Installation

```npm install -g generate-graphql-app```

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

### Extended documentation

Please check out the [extended documentation](https://tomyitav.github.io/generate-graphql-app) for more information
