# 0.2.9

## Breaking Changes

* No longer remove the `Host` and `Cookie` headers. If you want to remove them, configure it on each route entry.

* `server.js` script is removed.To invoque Nezaldi, you should now use `npm nezaldi`.

## Non breaking changes

* Default configuration file is now named `nezaldi.json` but old `.nezaldi.json` files will still work.
