import { onRequestOptions as __api_chatwoot_config_js_onRequestOptions } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/chatwoot-config.js"
import { onRequestOptions as __api_chatwoot_hmac_js_onRequestOptions } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/chatwoot-hmac.js"
import { onRequestOptions as __api_send_mail_js_onRequestOptions } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/send-mail.js"
import { onRequestPost as __api_send_mail_js_onRequestPost } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/send-mail.js"
import { onRequestGet as __api_test_js_onRequestGet } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/test.js"
import { onRequest as __api_chatwoot_config_js_onRequest } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/chatwoot-config.js"
import { onRequest as __api_chatwoot_hmac_js_onRequest } from "/Users/rahull/Desktop/Anti Gravity/IvoryTusk Website/IvoryTusk-Website/functions/api/chatwoot-hmac.js"

export const routes = [
    {
      routePath: "/api/chatwoot-config",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_chatwoot_config_js_onRequestOptions],
    },
  {
      routePath: "/api/chatwoot-hmac",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_chatwoot_hmac_js_onRequestOptions],
    },
  {
      routePath: "/api/send-mail",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_send_mail_js_onRequestOptions],
    },
  {
      routePath: "/api/send-mail",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_send_mail_js_onRequestPost],
    },
  {
      routePath: "/api/test",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_test_js_onRequestGet],
    },
  {
      routePath: "/api/chatwoot-config",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_chatwoot_config_js_onRequest],
    },
  {
      routePath: "/api/chatwoot-hmac",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_chatwoot_hmac_js_onRequest],
    },
  ]