class User {
  readonly username: string;
  readonly password: string;
  readonly email: string;

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  validateName() {
    if (!this.username) {
      throw new Error("Name is required");
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      throw new Error("Invalid email");
    }
  }

  validatePassword() {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!this.password || !passwordRegex.test(this.password)) {
      throw new Error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
      );
    }
  }

  validateUser() {
    this.validateName();
    this.validateEmail();
    this.validatePassword();
  }

  getUser() {
    this.validateUser();
    return {
      name: this.username,
      email: this.email,
      password: this.password,
    };
  }
}

export default User;
