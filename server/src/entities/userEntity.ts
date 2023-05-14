export interface IUser {
  username: string;
  password: string;
  email: string;
  uuid: string;
}

class User {
  readonly username: string;
  readonly password: string;
  readonly email: string;

  constructor(username: string, password: string, email: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }

  async validateUser(
    generateId: () => string,
    hashPassword: (password: string) => Promise<string>
  ) {
    let errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.username) {
      errors.push("Name is required");
    }
    if (!this.email || !emailRegex.test(this.email)) {
      errors.push("Invalid email");
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!this.password || !passwordRegex.test(this.password)) {
      errors.push(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
      );
    }

    if (errors.length > 0) {
      return { error: errors };
    } else {
      const hashedPassword = await hashPassword(this.password);
      return {
        email: this.email,
        password: hashedPassword,
        username: this.username,
        uuid: generateId(),
      };
    }
  }
}
export default User;
