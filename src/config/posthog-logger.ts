import { posthog } from './posthog'

type LogAttributes = Record<string, boolean | number | string>

export const posthogLog = {
  info: (message: string, attributes: LogAttributes = {}) => {
    posthog?.logger.info(message, attributes)
  },
  warn: (message: string, attributes: LogAttributes = {}) => {
    posthog?.logger.warn(message, attributes)
  },
}
