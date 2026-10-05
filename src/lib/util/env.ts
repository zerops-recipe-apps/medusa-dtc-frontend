import {
  isResolvedPublishableKey,
  readPublishableKeyFromEnv,
} from "@lib/util/publishable-key"

export const getBaseURL = () => {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (raw) {
    try {
      return new URL(raw).origin
    } catch {
      // Invalid NEXT_PUBLIC_BASE_URL must not crash layouts.
    }
  }
  return "https://localhost:8000"
}

function isUsableBackendUrl(value?: string): value is string {
  const trimmed = value?.trim()
  if (!trimmed || trimmed.includes("${")) {
    return false
  }

  try {
    const url = new URL(trimmed)
    if (!url.hostname) {
      return false
    }
    if (
      process.env.NODE_ENV === "production" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    ) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function getMedusaBackendUrl(): string {
  for (const candidate of [
    process.env.MEDUSA_BACKEND_URL,
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    process.env.API_URL,
  ]) {
    if (isUsableBackendUrl(candidate)) {
      return candidate.trim()
    }
  }

  return "http://localhost:9000"
}

export function getBrowserMedusaBackendUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/medusa`
  }

  return getMedusaBackendUrl()
}

export function getMedusaPublishableKey(): string {
  return readPublishableKeyFromEnv()
}

export { isResolvedPublishableKey }
