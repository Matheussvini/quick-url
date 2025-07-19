export class OwnerAlreadyExistsError extends Error {
  constructor() {
    super('Owner with this external_id already exists.');
  }
}
