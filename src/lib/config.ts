import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"
import {
  getBrowserMedusaBackendUrl,
  getMedusaBackendUrl,
  getMedusaPublishableKey,
} from "@lib/util/env"

function createMedusaClient() {
  const baseUrl =
    typeof window !== "undefined"
      ? getBrowserMedusaBackendUrl()
      : getMedusaBackendUrl()

  const client = new Medusa({
    baseUrl,
    debug: process.env.NODE_ENV === "development",
    publishableKey: getMedusaPublishableKey() || undefined,
  })

  const originalFetch = client.client.fetch.bind(client.client)
  client.client.fetch = async <T>(
    input: FetchInput,
    init?: FetchArgs
  ): Promise<T> => {
    const headers = { ...(init?.headers as Record<string, string>) }
    try {
      const localeHeader = await getLocaleHeader()
      const locale = localeHeader["x-medusa-locale"]
      if (locale) {
        headers["x-medusa-locale"] ??= locale
      }
    } catch {}

    return originalFetch<T>(input, { ...init, headers })
  }

  return client
}

export const sdk = new Proxy({} as Medusa, {
  get(_target, prop) {
    const client = createMedusaClient()
    const value = (client as Medusa)[prop as keyof Medusa]
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client)
    }
    return value
  },
})
