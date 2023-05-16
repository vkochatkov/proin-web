import { isEmpty } from 'lodash';

/**
 * Custom Errors handler
 */
export class ApiErrors extends Error {
  public static SESSION_NOT_FOUND = 401;
  public static UNSUBSCRIBED = 402;
  public static CHARGEBACK_FEE_UNPAID = 423;

  /**
   * Should be called after each requests when we expect some errors or validations
   */
  public static checkOnApiError({ error, errors, code, message }: any) {
    if (error) {
      throw new ApiErrors(error.message, errors.code);
    }
    if (errors && errors.length) {
      const is_error = !isEmpty(errors);

      if (is_error) {
        throw new ApiErrors(errors[0].text, errors[0].code);
      }
    }

    if (code) {
      throw new ApiErrors(message, code);
    }
  }

  public code: number;

  constructor(m: string, code: number) {
    super(m);
    this.name = 'API Errors';
    this.code = code;
  }
}

export default ApiErrors;
