export class Login {
  constructor(public username: string, public access: string) {}

  isValid(): boolean {
    return !!(this.username && this.access);
  }
}
