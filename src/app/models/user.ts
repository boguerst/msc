export class User {
  constructor(private pseudo: string, private email: string, private password: string) {
    this.email = email;
    this.password = password;
  }

  getPseudo() {
    return this.pseudo;
  }
}
