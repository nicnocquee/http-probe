/* eslint-disable complexity */
import { Notification } from '../interfaces/notification'
import {
  SMTPData,
  MailgunData,
  SendgridData,
  WebhookData,
  MailData,
} from './../interfaces/data'
import { Config } from '../interfaces/config'
import { Probe } from '../interfaces/probe'

export const validateConfig = async (configuration: Config) => {
  const data = configuration

  // Check if notifications object is exists
  if (!data.notifications || data.notifications.length === 0) {
    return {
      valid: false,
      message:
        'Notifications object does not exists or has length lower than 1!',
    }
  }

  // Validate probes
  if (!data.probes || data.probes.length === 0) {
    return {
      valid: false,
      message: 'Probes object does not exists or has length lower than 1!',
    }
  }

  // Check notifications properties
  for (const notification of data.notifications) {
    const { type, data } = notification as Notification

    // Check if type equals to mailgun, smtp, or sendgrid, and has no recipients
    if (
      ['mailgun', 'smtp', 'sendgrid'].indexOf(type) >= 0 &&
      (!(data as MailData).recipients ||
        (data as MailData).recipients.length === 0)
    ) {
      return {
        valid: false,
        message: 'Recipients does not exists or has length lower than 1!',
      }
    }

    switch (type) {
      case 'smtp':
        if (!(data as SMTPData).hostname) {
          return {
            valid: false,
            message: 'Hostname not found',
          }
        }

        if (!(data as SMTPData).port) {
          return {
            valid: false,
            message: 'Port not found',
          }
        }

        if (!(data as SMTPData).username) {
          return {
            valid: false,
            message: 'Username not found',
          }
        }

        if (!(data as SMTPData).password) {
          return {
            valid: false,
            message: 'Password not found',
          }
        }
        break
      case 'mailgun':
        if (!(data as MailgunData).apiKey) {
          return {
            valid: false,
            message: 'API key not found',
          }
        }

        if (!(data as MailgunData).domain) {
          return {
            valid: false,
            message: 'Domain not found',
          }
        }
        break

      case 'sendgrid':
        if (!(data as SendgridData).apiKey) {
          return {
            valid: false,
            message: 'API key not found',
          }
        }
        break

      case 'webhook':
        if (!(data as WebhookData).url) {
          return {
            valid: false,
            message: 'URL not found',
          }
        }

        if (!(data as WebhookData).method) {
          return {
            valid: false,
            message: 'Method not found',
          }
        }
        break

      default:
        return {
          valid: false,
          message: 'Notifications type is not allowed',
        }
    }
  }

  // Check probes properties
  for (const probe of data.probes) {
    const { alerts, name, request } = probe as Probe

    if (!alerts || alerts.length === 0) {
      return {
        valid: false,
        message: 'Alerts does not exists or has length lower than 1!',
      }
    }

    if (!name) {
      return {
        valid: false,
        message: 'Probe name should not be empty',
      }
    }

    if (!request) {
      return {
        valid: false,
        message: 'Probe request should not be empty',
      }
    }
  }

  return {
    valid: true,
    message: '',
  }
}
