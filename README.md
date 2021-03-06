[![npm](https://img.shields.io/npm/v/nezaldi.svg)]()

Nezaldi
=======

From the Nahuatl 'Path' or 'Trail'. Nezaldi is an _HTTP Proxy Server_ created to help developers that need to serve several sources 
under the same domain.

![Diagram](diagram_01.png)

Nezaldi works as a simplistic replacement for Nginx or other HTTP routers. 
**It is not intended to be used in production environments**. If you need a router in production, you should be 
using Nginx. But if you need to have a router in your local environment and you don't want or can't install Nginx locally
Nezaldi will be a great option.

The most common use case and the one that inspired me to create this tool is when you are developing a _serverless_
single page application (SPA) which may be served by a local development server as _Webpack_ and that also needs access
to an API in another server, it may be local or remote, or probably more than one of this APIs. In these cases, you want 
all resources to be served as if they were under the same domain or server. This is what Nezaldi will do.

## Usage

Install it with NPM:

    npm install nezaldi
    
or Yarn

    yarn add nezaldi --dev

Create a file in your project root named `nezaldi.json` and write your route configuration there:

```json
{
  "debug": false,
  "rules": [
    {
      "path": "^/$",
      "resetPath": true,
      "target": "http://localhost:4000/index.html"
    },
    {
      "path": "^/bundles/",
      "target": "http://mywebpackserver/bundles/"
    },
    {
      "path": "^/redirect/",
      "redirect": "http://myotherserver/home/"
    },
    {
      "path": "^/(books|pets)/",
      "target": "http://$1-server/"
    },
    {
      "path": "^/html/",
      "accept": "text/html",
      "target": "http://myhtmlserver/"
    },
    {
      "path": "^/users/",
      "target": "http://myserverneedsaheader/",
      "addHeaders": [
        {
          "name": "X-MyHeader",
          "value": "Hello Header"
        }
      ]
    }
  ]
}
```

Start the server from a `package.json` script:

```json
{
    "scripts": {
      "start": "npm nezaldi"
    }
}
```
    
### Available Options

* `--conf` Configuration file to use, by default it will use `nezaldi.json`
* `-p <port>` Sets the port for running Nezaldi. Default 3000. It can be specified in the configuration file.


### Global Configuration Settings

* **debug** [Boolean] It will print information on the console on every request, including path, match and headers

### Rule Configuration Settings

* **path** [String] The string should be a valid regex argument. It will be used to match rules with requests.
Rules are executed in order. If you have rules that are more specific than others, it is better to place the more
specific ones before the general ones

* **target** [String] This is the URL of the server that will be used when the rule matches

* **redirect** [String] URL to be used as a redirect response. 
`redirect` should not be used in combination with `target` setting in the same rule.

* **resetPath** [Boolean] Will force Nezaldi to not add any fragments to the target URL.
By default, Nezaldi will remove the *path* fragment from the url adding the rest of it to the
target url. For example, on the request `http://localhost:4000/a/b/c` lets suppose the match rule has path `^/a` and 
target `http://server/some/more/stuff/`, the default behavior will be to proxy the call to `http://server/some/more/stuff/b/c`
if you set *resetPath* to true, then the call will be to `http://server/some/more/stuff/`

* **accept** [String] Sometimes you want that a rule only applies when the `accept` type is a specific one, like `text/html`.
Use this property to limit the matches to only those containing the given accept type

* **addHeaders** [Key Value Map Array] In the case you need to add some headers to your calls that are not present
in the original request, you can do so by adding them here.

* **removeHeaders** [Key Value Map Array] In the case you need to remove some headers from the original request, 
you can do so by adding them here.

## Troubleshooting

* Error `ECONNREFUSED` when trying to connect to a local server running in `localhost`. Some servers when running in localhost
will not use the IPv4 address `127.0.0.1` which will be the one tried by NodeJS when the schema of the server is `localhost`.
Before doing any change, verify that a curl call works using `localhost`, if it does, it is probable that your server is not using
the IPv4 address but the IPv6 one. As a workaround you can change your target from something like `http://localhost:5555/a/b/c` to `http://[::1]:5555/a/b/c`.

## Dependencies

Nezaldi is intended to be superlight. It only depends on Node itself as a library.
In development mode it depends on Jasmine for testing and Elm for generating the _dashboard_ static resources.