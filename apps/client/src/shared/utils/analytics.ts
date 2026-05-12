import { Analytics } from '@apps-in-toss/web-framework';

type LogParams = Record<string, string | number | boolean>;

export function logEvent(eventName: string, params?: LogParams) {
  Analytics.screen({ log_name: eventName, ...params });
}

export function logImpression(componentName: string, params?: LogParams) {
  Analytics.impression({ log_name: componentName, ...params });
}

export function logPress(componentName: string, params?: LogParams) {
  Analytics.click({ log_name: componentName, ...params });
}
