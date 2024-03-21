export class LateCheckInValidationError extends Error {
  constructor(){
    super('The check-in has expired')
  }
}