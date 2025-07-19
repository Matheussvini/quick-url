export class ResourceNotFoundError extends Error {
  constructor(resource?: string) {
    super(
      resource ? `Resource not found: ${resource}.` : 'Resource not found.',
    );
  }
}
