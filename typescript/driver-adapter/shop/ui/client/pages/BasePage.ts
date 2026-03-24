import { PageClient } from '@optivem/driver-adapter/client/playwright';
import { Result } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { SystemError, SystemErrorField } from '../../../commons/dtos/errors/SystemError.js';
import { systemErrorOf } from '../../../commons/dtos/errors/SystemError.js';
import { failure, failureWithError, success } from '../../../commons/SystemResults.js';

export abstract class BasePage {
    private static readonly NOTIFICATION_SELECTOR = "[role='alert']";
    private static readonly NOTIFICATION_SUCCESS_SELECTOR = "[role='alert'].notification.success";
    private static readonly NOTIFICATION_ERROR_SELECTOR = "[role='alert'].notification.error";
    private static readonly NOTIFICATION_ERROR_MESSAGE_SELECTOR =
        "[role='alert'].notification.error .error-message";
    private static readonly NOTIFICATION_ERROR_FIELD_SELECTOR =
        "[role='alert'].notification.error .field-error";
    private static readonly NOTIFICATION_ID_ATTRIBUTE = 'data-notification-id';
    private static readonly NO_NOTIFICATION_ERROR_MESSAGE = 'No notification appeared';
    private static readonly UNRECOGNIZED_NOTIFICATION_ERROR_MESSAGE =
        'Notification type is not recognized';

    protected readonly pageClient: PageClient;

    private lastNotificationId: Optional<string> = null;

    constructor(pageClient: PageClient) {
        this.pageClient = pageClient;
    }

    protected async snapshotCurrentNotificationId(): Promise<void> {
        const locator = this.pageClient.getLocator(BasePage.NOTIFICATION_SELECTOR);
        if ((await locator.count()) > 0) {
            const id = await locator.getAttribute(BasePage.NOTIFICATION_ID_ATTRIBUTE);
            this.lastNotificationId = id;
        }
    }

    async getResult(): Promise<Result<string, SystemError>> {
        const notificationId = await this.waitForNewNotification();
        this.lastNotificationId = notificationId;

        const isSuccess = await this.isSuccessNotification(notificationId);

        if (isSuccess) {
            const successMessage = await this.readSuccessNotificationForId(notificationId);
            return success(successMessage);
        }

        const generalMessage = await this.readGeneralErrorMessageForId(notificationId);
        const fieldErrorTexts = await this.readFieldErrorsForId(notificationId);

        if (fieldErrorTexts.length === 0) {
            return failure(generalMessage);
        }

        const fieldErrors = fieldErrorTexts.map((text) => this.parseFieldError(text));
        const error = systemErrorOf(generalMessage, fieldErrors);
        return failureWithError(error);
    }

    private async waitForNewNotification(): Promise<string> {
        const selector =
            this.lastNotificationId == null
                ? BasePage.NOTIFICATION_SELECTOR
                : `${BasePage.NOTIFICATION_SELECTOR}:not([${BasePage.NOTIFICATION_ID_ATTRIBUTE}='${this.lastNotificationId}'])`;

        const hasNotification = await this.pageClient.isVisibleAsync(selector);

        if (!hasNotification) {
            throw new Error(BasePage.NO_NOTIFICATION_ERROR_MESSAGE);
        }

        const notificationId = await this.pageClient.readAttributeAsync(selector, BasePage.NOTIFICATION_ID_ATTRIBUTE);

        if (notificationId == null) {
            throw new Error(
                `Notification element does not have ${BasePage.NOTIFICATION_ID_ATTRIBUTE} attribute`
            );
        }
        return notificationId;
    }

    private async isSuccessNotification(notificationId: string): Promise<boolean> {
        const successSelector = BasePage.withNotificationId(
            BasePage.NOTIFICATION_SUCCESS_SELECTOR,
            notificationId
        );
        const successLocator = this.pageClient.getLocator(successSelector);
        if ((await successLocator.count()) > 0) return true;

        const errorSelector = BasePage.withNotificationId(
            BasePage.NOTIFICATION_ERROR_SELECTOR,
            notificationId
        );
        const errorLocator = this.pageClient.getLocator(errorSelector);
        if ((await errorLocator.count()) > 0) return false;

        throw new Error(BasePage.UNRECOGNIZED_NOTIFICATION_ERROR_MESSAGE);
    }

    private async readSuccessNotificationForId(notificationId: string): Promise<string> {
        const selector = BasePage.withNotificationId(
            BasePage.NOTIFICATION_SUCCESS_SELECTOR,
            notificationId
        );
        return await this.pageClient.readTextContentAsync(selector);
    }

    private async readGeneralErrorMessageForId(notificationId: string): Promise<string> {
        const selector = BasePage.withNotificationId(
            BasePage.NOTIFICATION_ERROR_MESSAGE_SELECTOR,
            notificationId
        );
        return await this.pageClient.readTextContentAsync(selector);
    }

    private async readFieldErrorsForId(notificationId: string): Promise<string[]> {
        const selector = BasePage.withNotificationId(
            BasePage.NOTIFICATION_ERROR_FIELD_SELECTOR,
            notificationId
        );
        if (!(await this.pageClient.isVisibleAsync(selector))) {
            return [];
        }
        return await this.pageClient.readAllTextContentsAsync(selector);
    }

    private parseFieldError(text: string): SystemErrorField {
        const idx = text.indexOf(':');
        if (idx < 0) {
            throw new Error(`Invalid field error format: ${text}`);
        }
        return { field: text.slice(0, idx).trim(), message: text.slice(idx + 1).trim() };
    }

    private static withNotificationId(selector: string, notificationId: string): string {
        const idAttribute = `[${BasePage.NOTIFICATION_ID_ATTRIBUTE}='${notificationId}']`;
        return selector.replace(
            BasePage.NOTIFICATION_SELECTOR,
            BasePage.NOTIFICATION_SELECTOR + idAttribute
        );
    }
}



