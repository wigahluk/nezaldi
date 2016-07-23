Nezaldi
=======

From the Nahuatl 'Path' or 'Trail'. Nezaldi is an http proxy server created to help developers to keep a very thin
setup on projects that require multiple backend servers usually behind Nginx or similar technology.  

Nezaldi is not intended to be used in production environments, but in development ones.

## Usage

Install it with NPM:

    npm install nezaldi
    
Create a file in your project root named `.nezaldi.json` and write your route configuration there:

    {
      "debug": false,
      "defaultUrl": "http://localhost:4000",
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
          "path": "^/(books|pets)/",
          "target": "http://$1-server/"
        },
        {
          "path": "^/html/",
          "accept": "text/html"
          "target": "http://myhtmlserver/"
        },
        {
          "path": "^/users/",
          "target": "http://myserverneedsaheader/"
          "addHeaders": [
            {
              "name": "X-MyHeader",
              "value": "Hello Header"
            }
          ]
        }
      ]
    }

Start the server

    node nezaldi
    
### Available Options

`--conf` Configuration file to use, by default it will use `.nezaldi.json`

### Global Configuration Settings

* **debug** [Boolean] It will print information on the console on every request, including path, match and headers
* **defaultUrl** [String] The URL that will be used if there is match for a request

### Rule Configuration Settings

* **path** [String] The string should be a valid regex argument. It will be used to match rules with requests.
Rules are executed in order. If you have rules that are more specific than others, it is better to place the more
specific ones before the general ones

* **target** [String] This is the URL of the server that will be used when the rule matches

* **resetPath** [Boolean] Will force Nezaldi to not add any fragments to the target URL.
By default, Nezaldi will remove the *path* fragment from the url adding the rest of it to the
target url. For example, on the request `http://localhost:4000/a/b/c` lets suppose the match rule has path `^/a` and 
target `http://server/some/more/stuff/`, the default behavior will be to proxy the call to `http://server/some/more/stuff/b/c`
if you set *resetPath* to true, then the call will be to `http://server/some/more/stuff/`

* **accept** [String] Sometimes you want that a rule only applies when the `accept` type is a specific one, like `text/html`.
Use this property to limit the matches to only those containing the given accept type

* **addHeaders** [Key Value Map Array] In the case you need to add some headers to your calls that are not present
in the original request, you can do so by adding them here.

### Some notes

Nezaldi will remove the `Host` and `Cookie` Headers of each request before sending it to the target.