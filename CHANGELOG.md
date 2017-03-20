# 1.0.4

* Adding ID to transactions in the log

# 1.0.3

* SVG MIME Type added
* Style changes on the dashboard
* The dashboard now shows the regex that caused the match

# 1.0.1

Fixing multiple replacements

# 1.0.0

This version introduces a new **Dashboard** that developers can use for debugging.

## Breaking Changes

* Nezaldi now ignores the `defaultUrl` field in the configuration file. If a call has no match, it will respond with a generic 404 message.
If you want to control what will be responded, you can add a catch all route.

## Non breaking changes

* You can specify a local path on the `target` value. It will serve files from your local file system.
* Redirect and Local Static rules support capture groups as regular proxy calls.


# 0.3.2

* Removing dependency on `express`.
After this upgrade you may want to run `npm prune` to remove unused modules.

# 0.3.1

* Removing dependency on `http-proxy` and handling error when a request fails.
After this upgrade you may want to run `npm prune` to remove unused modules.

# 0.3.0

## Non breaking changes

* Routes can also be configured as redirects.

# 0.2.9

## Breaking Changes

* No longer remove the `Host` and `Cookie` headers. If you want to remove them, configure it on each route entry.

* `server.js` script is removed.To invoque Nezaldi, you should now use `npm nezaldi`.

## Non breaking changes

* Default configuration file is now named `nezaldi.json` but old `.nezaldi.json` files will still work.
