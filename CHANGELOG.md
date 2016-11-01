# 0.3.1

Removing dependency on `http-proxy` and handling error when a request fails.

# 0.3.0

## Non breaking changes

* Routes can also be configured as redirects.

# 0.2.9

## Breaking Changes

* No longer remove the `Host` and `Cookie` headers. If you want to remove them, configure it on each route entry.

* `server.js` script is removed.To invoque Nezaldi, you should now use `npm nezaldi`.

## Non breaking changes

* Default configuration file is now named `nezaldi.json` but old `.nezaldi.json` files will still work.
