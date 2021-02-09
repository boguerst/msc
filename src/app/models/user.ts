export class User {
  constructor(private pseudo: string, private email: string, private password: string, private uid: string) {
    this.email = email;
    this.password = password;
  }

  getPseudo() {
    return this.pseudo;
  }

  getUid() {
    return this.uid;
  }
}
