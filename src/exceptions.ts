export class HipcallAPIException extends Error {
  public readonly statusCode: number;
  public readonly status_code: number;
  public readonly content: Record<string, any> | null;

  constructor(statusCode: number, content: Record<string, any> | null = null, message?: string) {
    super(message ?? `Unexpected error. Status: ${statusCode}, Content: ${JSON.stringify(content)}`);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status_code = statusCode;
    this.content = content;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  get detail(): Record<string, any> | null {
    return this.content;
  }

  get errors(): any {
    if (this.content && typeof this.content === "object" && "errors" in this.content) {
      return this.content.errors;
    }
    return null;
  }
}

export class BadRequestException extends HipcallAPIException {
  constructor(statusCode: number, content: Record<string, any> | null = null) {
    const errors = content && typeof content === "object" ? content.errors : null;
    let detail: any;
    if (errors && typeof errors === "object" && "detail" in errors) {
      detail = errors.detail;
    } else if (errors) {
      detail = errors;
    } else {
      detail = content;
    }
    const formatted = typeof detail === "string" ? detail : JSON.stringify(detail);
    super(statusCode, content, `Bad request: ${formatted}`);
  }
}

export class UnauthorizedException extends HipcallAPIException {
  constructor(statusCode: number, content: Record<string, any> | null = null) {
    super(statusCode, content, "Invalid API key or unauthorized access");
  }
}

export class NotFoundException extends HipcallAPIException {
  constructor(statusCode: number, content: Record<string, any> | null = null) {
    super(statusCode, content, "The requested resource was not found");
  }
}

export class UnprocessableEntityException extends HipcallAPIException {
  constructor(statusCode: number, content: Record<string, any> | null = null) {
    let errors: any = content && typeof content === "object" ? content.errors : null;
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      errors = Object.entries(errors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
        .join(" | ");
    } else if (errors === null || errors === undefined) {
      errors = JSON.stringify(content);
    }
    super(statusCode, content, `The request was unprocessable: Errors: ${errors}`);
  }
}

export const EXCEPTION_MAP: Record<
  number,
  new (statusCode: number, content: Record<string, any> | null) => HipcallAPIException
> = {
  400: BadRequestException,
  401: UnauthorizedException,
  404: NotFoundException,
  422: UnprocessableEntityException,
};
