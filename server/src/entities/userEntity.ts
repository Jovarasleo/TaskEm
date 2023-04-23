class User {
  readonly username: string;
  readonly password: string;
  readonly email: string;

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}

export default User;
