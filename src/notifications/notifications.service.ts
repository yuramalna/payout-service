import { Injectable, Logger } from '@nestjs/common';

/**
 * Stub notification channel. In production this posts to the messaging
 * platform; here it logs and simulates delivery latency so callers must
 * treat delivery as genuinely asynchronous and fallible.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async send(recipientEmail: string, message: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 25));
    if (recipientEmail.endsWith('.invalid')) {
      throw new Error(`Undeliverable address: ${recipientEmail}`);
    }
    this.logger.log(`Notified ${recipientEmail}: ${message}`);
  }
}
