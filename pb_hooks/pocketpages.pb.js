if (typeof module === 'undefined') { module = { exports: {} } };
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AfterBootstrapHandler: () => AfterBootstrapHandler,
  MiddlewareHandler: () => MiddlewareHandler,
  globalApi: () => globalApi,
  log: () => log3,
  moduleExists: () => moduleExists,
  stringify: () => import_pocketbase_stringify4.stringify
});
module.exports = __toCommonJS(src_exports);
var log3 = __toESM(require("pocketbase-log"));
var import_pocketbase_stringify4 = require("pocketbase-stringify");

// ../../node_modules/@s-libs/micro-dash/fesm2022/micro-dash.mjs
function clone(value) {
  if (Array.isArray(value)) {
    return value.slice();
  } else if (value instanceof Object) {
    return { ...value };
  } else {
    return value;
  }
}
function keys(object) {
  let val = keysOfNonArray(object);
  if (Array.isArray(object)) {
    val = val.filter((item) => item !== "length");
  }
  return val;
}
function keysOfNonArray(object) {
  return object ? Object.getOwnPropertyNames(object) : [];
}
function forOwnOfNonArray(object, iteratee) {
  forEachOfArray(keysOfNonArray(object), (key) => iteratee(object[key], key));
  return object;
}
function forEach(collection, iteratee) {
  if (Array.isArray(collection)) {
    forEachOfArray(collection, iteratee);
  } else {
    forOwnOfNonArray(collection, iteratee);
  }
  return collection;
}
function forEachOfArray(array, iteratee) {
  for (let i = 0, len = array.length; i < len; ++i) {
    if (iteratee(array[i], i) === false) {
      break;
    }
  }
}
function merge(object, ...sources) {
  for (const source of sources) {
    forEach(source, (value, key) => {
      const myValue = object[key];
      if (myValue instanceof Object) {
        value = merge(clone(myValue), value);
      }
      object[key] = value;
    });
  }
  return object;
}
function omit(object, ...paths) {
  const obj = clone(object) ?? {};
  for (const path of paths) {
    delete obj[path];
  }
  return obj;
}

// src/handlers/AfterBootstrapHandler.ts
var import_pocketbase_log2 = require("pocketbase-log");
var import_pocketbase_node2 = require("pocketbase-node");

// src/lib/debug.ts
var log = __toESM(require("pocketbase-log"));
var dbg2 = (...args) => {
  const dbgVal = $app.store().get("__pocketpages_debug");
  if (!dbgVal) return;
  return log.dbg(...args);
};

// src/lib/helpers.ts
var import_pocketbase_node = require("pocketbase-node");
var import_pocketbase_stringify = require("pocketbase-stringify");
var pagesRoot = $filepath.join(__hooks, `pages`);
var SAFE_HEADER = `if (typeof module === 'undefined') { module = { exports: {} } };`;
var exts = ["", ".js", ".json"];
var moduleExists = (path) => {
  for (let i = 0; i < exts.length; i++) {
    if (import_pocketbase_node.fs.existsSync(path + exts[i])) {
      return true;
    }
  }
  return false;
};
var simulateRequire = (path) => {
  for (let i = 0; i < exts.length; i++) {
    try {
      return import_pocketbase_node.fs.readFileSync(path + exts[i], "utf-8");
    } catch (e) {
      continue;
    }
  }
  throw new Error(`No module '${path}' found`);
};
var NotFoundError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
};
var mkResolve = (rootPath) => (path, options) => {
  const _require = (path2) => {
    if (!moduleExists(path2)) {
      throw new NotFoundError(`No module '${path2}' found`);
    }
    switch (options?.mode || "require") {
      case "raw":
        return simulateRequire(path2);
      case "require":
        return require(path2);
      case "script":
        return `<script>
${SAFE_HEADER}
${simulateRequire(path2)}
</script>`;
      case "style":
        return `<style>
${simulateRequire(path2)}
</style>`;
    }
  };
  if (path.startsWith("/")) {
    const finalPath = $filepath.join(pagesRoot, "_private", path);
    try {
      return _require(finalPath);
    } catch (e) {
      throw new Error(`No module '${finalPath}' found`);
    }
  }
  let currentPath = rootPath;
  while (currentPath.length >= pagesRoot.length) {
    try {
      const finalPath = $filepath.join(currentPath, "_private", path);
      return _require(finalPath);
    } catch (e) {
      const errorMsg = `${e}`;
      if (!(e instanceof NotFoundError)) {
        throw e;
      }
      if (currentPath === pagesRoot) {
        throw new Error(
          `No module '${path}' found in _private directories from ${rootPath} up to ${pagesRoot}`
        );
      }
      currentPath = $filepath.dir(currentPath);
    }
  }
  throw new Error(`Unreachable code reached`);
};
var mkMeta = () => {
  const metaData = {};
  return (key, value) => {
    if (value === void 0) {
      return metaData[key];
    }
    return metaData[key] = value;
  };
};
var echo = (...args) => {
  const result = args.map((arg) => {
    if (typeof arg === "function") {
      return arg.toString();
    } else if (typeof arg === "object") {
      return (0, import_pocketbase_stringify.stringify)(arg);
    } else if (typeof arg === "number") {
      return arg.toString();
    }
    return `${arg}`;
  });
  return result.join(" ");
};

// src/lib/loadPlugins.ts
var import_pocketbase_log = require("pocketbase-log");

// src/lib/globalApi.ts
var log2 = __toESM(require("pocketbase-log"));
var import_pocketbase_stringify2 = require("pocketbase-stringify");
var import_url_parse = __toESM(require("url-parse"));
var globalApi = {
  url: (path) => (0, import_url_parse.default)(path, true),
  stringify: import_pocketbase_stringify2.stringify,
  env: (key) => process.env[key] ?? "",
  store: (name, value) => {
    if (value === void 0) {
      return $app.store().get(name);
    }
    $app.store().set(name, value);
  },
  ...log2
};

// src/lib/loadPlugins.ts
var normalizePlugin = (plugin) => {
  if (typeof plugin === "string") {
    return { debug: false, fn: loadFactory(plugin) };
  }
  if (typeof plugin === "function") {
    return { debug: false, fn: plugin };
  }
  if (typeof plugin === "object" && "fn" in plugin) {
    return { debug: false, fn: plugin.fn, ...plugin };
  }
  if (typeof plugin === "object" && "name" in plugin) {
    return {
      debug: false,
      ...omit(plugin, "name"),
      fn: loadFactory(plugin.name)
    };
  }
  throw new Error("Invalid plugin config");
};
var loadFactory = (plugin) => {
  const factory = (() => {
    const module2 = require(plugin);
    return module2.default ?? module2;
  })();
  dbg2(`factory`, { factory });
  return factory;
};
var loadPlugins = (cache) => {
  const { config, routes } = cache;
  return [
    ...config.plugins.map((plugin) => {
      const normalizedPlugin = normalizePlugin(plugin);
      const extra = omit(normalizedPlugin, "fn");
      const factoryConfig = {
        pagesRoot,
        config,
        globalApi,
        routes,
        dbg: extra.debug ? globalApi.dbg : dbg2
      };
      dbg2(`loading plugin`, { factoryConfig, extra, plugin });
      try {
        return normalizedPlugin.fn(factoryConfig, extra);
      } catch (e) {
        (0, import_pocketbase_log.error)(`error loading plugin`, { plugin, error: e });
        throw e;
      }
    })
  ];
};

// src/handlers/AfterBootstrapHandler.ts
var LOADER_METHODS = [
  "load",
  "get",
  "post",
  "put",
  "patch",
  "delete"
];
var AfterBootstrapHandler = (e) => {
  (0, import_pocketbase_log2.info)(`pocketpages startup`);
  if (!import_pocketbase_node2.fs.existsSync(pagesRoot)) {
    throw new Error(
      `${pagesRoot} must exist. Did you launch pocketbase with --dir or --hooksDir`
    );
  }
  const VALID_CONFIG_KEYS = ["plugins", "debug"];
  const configPath = $filepath.join(pagesRoot, `+config.js`);
  const config = {
    plugins: [`pocketpages-plugin-ejs`],
    debug: false,
    ...(() => {
      try {
        return require(configPath);
      } catch (e2) {
        (0, import_pocketbase_log2.error)(`Error loading config file: ${e2}`);
        return {};
      }
    })()
  };
  if (config.debug) {
    $app.store().set("__pocketpages_debug", true);
  }
  keys(config).forEach((key) => {
    if (!VALID_CONFIG_KEYS.includes(key)) {
      throw new Error(`Invalid config key: ${key}`);
    }
  });
  const physicalFiles = [];
  $filepath.walkDir(pagesRoot, (path, d, err) => {
    const isDir = d.isDir();
    if (isDir) {
      return;
    }
    physicalFiles.push(path.slice(pagesRoot.length + 1));
  });
  dbg2({ physicalFiles });
  const routableFiles = physicalFiles.filter((f) => {
    const notRoutable = [/^[-+_]/];
    const pathParts = $filepath.toSlash(f).split("/");
    return !pathParts.some((part) => notRoutable.some((r) => r.test(part)));
  });
  dbg2({ routableFiles });
  const plugins = loadPlugins({
    config,
    routes: []
  });
  const routes = routableFiles.map((relativePath) => {
    dbg2(`Examining route`, relativePath);
    const partsWithoutGroupNames = $filepath.toSlash(relativePath).split("/").filter((p) => !p.startsWith(`(`));
    const absolutePath = $filepath.join(pagesRoot, relativePath);
    dbg2({ relativePath, absolutePath, partsWithoutGroupNames });
    const content = toString($os.readFile(absolutePath));
    const contentSha = $security.sha256(content);
    const route = {
      relativePath,
      absolutePath,
      fingerprint: contentSha,
      assetPrefix: partsWithoutGroupNames[partsWithoutGroupNames.length - 2] ?? "",
      segments: partsWithoutGroupNames.map((part) => {
        return {
          nodeName: part,
          paramName: part.match(/\[.*\]/) ? part.replace(/\[(.*)\].*$/g, "$1") : void 0
        };
      }),
      middlewares: [],
      layouts: [],
      loaders: {},
      isStatic: false
    };
    route.isStatic = !plugins.some(
      (p) => p.handles?.({ route, filePath: absolutePath })
    );
    if (route.isStatic) {
      return route;
    }
    const lastSegment = route.segments[route.segments.length - 1];
    lastSegment.nodeName = $filepath.base(lastSegment.nodeName).slice(0, -$filepath.ext(lastSegment.nodeName).length);
    {
      const pathParts = $filepath.toSlash($filepath.dir(relativePath)).split(`/`).filter((node) => node !== ".").filter((p) => !!p);
      dbg2(`layout`, { pathParts }, $filepath.dir(relativePath));
      do {
        const maybeLayouts = $filepath.glob(
          $filepath.join(pagesRoot, ...pathParts, `+layout.*`)
        );
        dbg2({ pathParts, maybeLayouts });
        if (maybeLayouts && maybeLayouts.length > 0) {
          if (maybeLayouts.length > 1) {
            throw new Error(`Multiple layouts found for ${relativePath}`);
          }
          const maybeLayout = maybeLayouts[0];
          route.layouts.push(maybeLayout);
          dbg2(`layout found`, { maybeLayout });
        }
        if (pathParts.length === 0) {
          break;
        }
        pathParts.pop();
      } while (true);
    }
    {
      const pathParts = $filepath.toSlash($filepath.dir(relativePath)).split(`/`).filter((p) => !!p);
      const current = [pagesRoot];
      do {
        const maybeMiddleware = $filepath.join(...current, `+middleware.js`);
        if (import_pocketbase_node2.fs.existsSync(maybeMiddleware, "file")) {
          route.middlewares.push(maybeMiddleware);
        }
        if (pathParts.length === 0) {
          break;
        }
        current.push(pathParts.shift());
      } while (true);
    }
    {
      forEach(LOADER_METHODS, (method) => {
        const maybeLoad = $filepath.join(
          pagesRoot,
          $filepath.dir(route.relativePath),
          `+${method}.js`
        );
        if (import_pocketbase_node2.fs.existsSync(maybeLoad)) {
          route.loaders[method] = maybeLoad;
        }
      });
    }
    return route;
  }).filter((r) => r.segments.length > 0);
  dbg2({ routes });
  const cache = { routes, config };
  dbg2({ cache });
  $app.store().set(`pocketpages`, cache);
};

// src/handlers/MiddlewareHandler.ts
var cookie = __toESM(require("cookie"));
var import_pocketbase_log3 = require("pocketbase-log");
var import_pocketbase_stringify3 = require("pocketbase-stringify");

// src/lib/fingerprint.ts
var fingerprint = (nodeName, fingerprint2) => {
  const lastDotIndex = nodeName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return `${nodeName}.${fingerprint2}`;
  }
  const base = nodeName.slice(0, lastDotIndex);
  const ext = nodeName.slice(lastDotIndex);
  return `${base}.${fingerprint2}${ext}`;
};

// src/handlers/MiddlewareHandler.ts
var import_url_parse2 = __toESM(require("url-parse"));

// src/lib/resolveRoute.ts
var qs = __toESM(require("qs-lite"));
var resolveRoute = (url, routes) => {
  const { config } = $app.store().get(`pocketpages`);
  const urlPath = url.pathname.slice(1);
  dbg2(`***resolveRoute`, { url, urlPath });
  const params = qs.parse(url.query.slice(1));
  const tryFnames = [urlPath || "index"];
  if (tryFnames[0] !== "index") {
    tryFnames.push(`${urlPath}/index`);
  }
  dbg2({ tryFnames });
  for (const maybeFname of tryFnames) {
    const parts = $filepath.toSlash(maybeFname).split("/").filter((p) => p);
    dbg2(`incoming parts`, parts);
    for (const route of routes) {
      dbg2(`checking route`, route);
      const matched = route.segments.every((segment, i) => {
        const { nodeName, paramName } = segment;
        if (paramName) return true;
        const part = parts[i];
        const matchesWithFingerprint = (() => {
          if (i !== route.segments.length - 1) return false;
          if (!route.isStatic) return false;
          const fingerprinted = fingerprint(segment.nodeName, route.fingerprint);
          dbg2(`fingerprint details`, { segment, fingerprinted, parts });
          return fingerprinted === parts[i];
        })();
        dbg2(`match status`, { nodeName, part, matchesWithFingerprint });
        return nodeName === part || matchesWithFingerprint;
      });
      if (matched) {
        dbg2(`Matched route`, route);
        route.segments.forEach((segment, i) => {
          const { paramName } = segment;
          if (paramName) {
            params[paramName] = parts[i];
            return true;
          }
        });
        return { route, params };
      }
    }
  }
  return null;
};

// src/handlers/MiddlewareHandler.ts
var escapeXml = (unsafe = "") => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
};
var parseSlots = (input) => {
  const regex = /<!--\s*slot:(\w+)\s*-->([\s\S]*?)(?=<!--\s*slot:\w+\s*-->|$)/g;
  const slots = {};
  let lastIndex = 0;
  let cleanedContent = "";
  let match;
  while ((match = regex.exec(input)) !== null) {
    const name = match[1];
    const content = match[2]?.trim();
    if (name && content) {
      slots[name] = content;
      cleanedContent += input.slice(lastIndex, match.index);
      lastIndex = match.index + match[0].length;
    }
  }
  cleanedContent += input.slice(lastIndex);
  return {
    slots,
    content: cleanedContent.trim()
  };
};
var defaultResponder = {
  onResponse: ({ content, api, route }) => {
    const { response } = api;
    response.html(200, content);
    return true;
  }
};
var MiddlewareHandler = (e) => {
  const next = () => {
    e.next();
  };
  if (!e.request) {
    dbg2(`No request, passing on to PocketBase`);
    return next();
  }
  const { method, url } = e.request;
  dbg2({ method, url });
  if (!url) {
    dbg2(`No URL, passing on to PocketBase`);
    return next();
  }
  dbg2(`Pages middleware request: ${method} ${url}`);
  const request = {
    event: e,
    auth: e.auth,
    method: method.toUpperCase(),
    url: (0, import_url_parse2.default)(url.string()),
    formData: () => e.requestInfo().body,
    body: () => e.requestInfo().body,
    header: (name) => {
      return e.request?.header.get(name) || "";
    },
    cookies: /* @__PURE__ */ (() => {
      let parsed;
      const tryParseJson = (value) => {
        if (!value) return value;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      };
      const cookieFunc = (name) => {
        if (!parsed) {
          const cookieHeader = request.header("Cookie");
          const rawParsed = cookie.parse(cookieHeader || "");
          parsed = Object.fromEntries(
            Object.entries(rawParsed).map(([key, value]) => [
              key,
              tryParseJson(value)
            ])
          );
        }
        if (name === void 0) {
          return parsed;
        }
        return parsed[name];
      };
      return cookieFunc;
    })()
  };
  const response = {
    file: (path) => {
      return e.fileFS($os.dirFS($filepath.dir(path)), $filepath.base(path));
    },
    write: (s) => {
      e.response.write(s);
    },
    redirect: (path, status = 302) => {
      e.redirect(status, path);
    },
    json: (status, data) => {
      e.json(status, data);
    },
    html: (status, data) => {
      e.html(status, data);
    },
    header: (name, value) => {
      if (value === void 0) {
        return e.response.header().get(name) || "";
      }
      e.response.header().set(name, value);
      return value;
    },
    cookie: (name, value, options = {}) => {
      const _options = {
        path: "/",
        ...options
      };
      const stringifiedValue = (() => {
        if (typeof value !== "string") {
          return (0, import_pocketbase_stringify3.stringify)(value);
        }
        return value;
      })();
      const serialized = cookie.serialize(name, stringifiedValue, _options);
      response.header(`Set-Cookie`, serialized);
      return serialized;
    }
  };
  const cache = $app.store().get(`pocketpages`);
  const { routes, config } = cache;
  const plugins = loadPlugins(cache);
  plugins.forEach((plugin) => plugin.onRequest?.({ request, response }));
  const resolvedRoute = resolveRoute(request.url, routes);
  if (!resolvedRoute) {
    dbg2(`No route matched for ${url}, passing on to PocketBase`);
    return next();
  }
  const { route, params } = resolvedRoute;
  const { absolutePath, relativePath } = route;
  try {
    if (route.isStatic) {
      dbg2(`Serving static file ${absolutePath}`);
      return response.file(absolutePath);
    }
    dbg2(`Found a matching route`, { resolvedRoute });
    const api = {
      ...globalApi,
      params,
      echo: (...args) => {
        const s = echo(...args);
        response.write(s);
        return s;
      },
      formData: request.formData,
      body: request.body,
      auth: request.auth,
      request,
      response,
      redirect: (path, _options) => {
        const options = {
          status: 302,
          message: "",
          ..._options
        };
        const parsed = globalApi.url(path);
        parsed.query.__flash = options.message;
        response.redirect(parsed.toString(), options.status);
      },
      slot: "",
      slots: {},
      asset: (path) => {
        const shortAssetPath = path.startsWith("/") ? path : $filepath.join(route.assetPrefix, path);
        const fullAssetPath = path.startsWith("/") ? path : $filepath.join(
          ...route.segments.slice(0, -2).map((s) => s.nodeName),
          route.assetPrefix,
          path
        );
        const assetRoute = resolveRoute(new import_url_parse2.default(fullAssetPath), routes);
        dbg2({ fullAssetPath, shortAssetPath, assetRoute });
        if (!assetRoute) {
          return `${shortAssetPath}`;
        }
        return fingerprint(shortAssetPath, assetRoute.route.fingerprint);
      },
      meta: mkMeta(),
      resolve: mkResolve($filepath.dir(absolutePath))
    };
    plugins.forEach((plugin) => plugin.onExtendContextApi?.({ api, route }));
    let data = {};
    route.middlewares.forEach((maybeMiddleware) => {
      dbg2(`Executing middleware ${maybeMiddleware}`);
      data = merge(data, require(maybeMiddleware)({ ...api, data }));
    });
    {
      const methods = ["load", method.toLowerCase(), method];
      forEach(methods, (method2) => {
        const loaderFname = route.loaders[method2];
        if (!loaderFname) return;
        dbg2(`Executing loader ${loaderFname}`);
        data = merge(data, require(loaderFname)({ ...api, data }));
      });
    }
    api.data = data;
    dbg2(`Final api:`, { params: api.params, data: api.data });
    delete api.echo;
    let content = plugins.reduce((content2, plugin) => {
      return plugin.onRender?.({
        content: content2,
        api,
        route,
        filePath: absolutePath,
        plugins
      }) ?? content2;
    }, "");
    try {
      dbg2(`Attempting to parse as JSON`);
      const parsed = JSON.parse(content);
      response.json(200, parsed);
      return true;
    } catch (e2) {
      dbg2(`Not JSON`);
    }
    route.layouts.forEach((layoutPath) => {
      const res = parseSlots(content);
      api.slots = res.slots;
      api.slot = res.slots.default || res.content;
      content = plugins.reduce((content2, plugin) => {
        return plugin.onRender?.({
          content: content2,
          api,
          route,
          filePath: layoutPath,
          plugins
        }) ?? content2;
      }, content);
    });
    for (const plugin of [...plugins, defaultResponder]) {
      if (plugin.onResponse?.({ content, api, route })) {
        return;
      }
    }
    throw new Error(`No plugin handled the response`);
  } catch (e2) {
    (0, import_pocketbase_log3.error)(e2);
    const message = (() => {
      const m = `${e2}`;
      if (m.includes("Value is not an object"))
        return `${m} - are you referencing a symbol missing from require() or resolve()?`;
      return `${e2}`;
    })();
    if (e2 instanceof BadRequestError) {
      return response.html(400, message);
    }
    const stackTrace = e2 instanceof Error ? e2.stack?.replaceAll(pagesRoot, "/" + $filepath.base(pagesRoot)).replaceAll(__hooks, "") : "";
    return response.html(
      500,
      `<html><body><h1>PocketPages Error</h1><pre><code>${escapeXml(message)}
${escapeXml(stackTrace)}</code></pre></body></html>`
    );
  }
};

// src/index.ts
var isInHandler = typeof onBootstrap === "undefined";
if (!isInHandler) {
  onBootstrap((e) => {
    e.next();
    require("pocketpages").AfterBootstrapHandler(e);
  });
  routerUse((e) => {
    require("pocketpages").MiddlewareHandler(e);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AfterBootstrapHandler,
  MiddlewareHandler,
  globalApi,
  log,
  moduleExists,
  stringify
});
