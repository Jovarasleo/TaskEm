export interface IUser {
  username: string;
  password?: string;
  email: string;
  uuid: string;
}

class User {
  readonly username: string;
  readonly password?: string;
  readonly email: string;
  readonly uuid: string;

  constructor({ username, password, email, uuid }: IUser) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.uuid = uuid;
  }

  async validateUser(generateId: () => string, hashPassword: (password: string) => Promise<string>) {
    let errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.username) {
      errors.push("Name is required");
    }

    if (!this.email || !emailRegex.test(this.email)) {
      errors.push("Invalid email");
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!this.password || !passwordRegex.test(this.password)) {
      errors.push("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number");
    }

    if (errors.length > 0) {
      return { error: errors };
    }

    const hashedPassword = await hashPassword(this.password as string);
    return {
      email: this.email,
      password: hashedPassword,
      username: this.username,
      uuid: generateId(),
    };
  }

  async validateGoogleUser() {
    let errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.username) {
      errors.push("Name is required");
    }

    if (!this.uuid) {
      errors.push("Id is required");
    }

    if (!this.email || !emailRegex.test(this.email)) {
      errors.push("Invalid email");
    }

    if (errors.length > 0) {
      return { error: errors };
    }

    return {
      email: this.email,
      password: "",
      username: this.username,
      uuid: this.uuid,
    };
  }
}

export default User;
