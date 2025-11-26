export interface AccountProps {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  private props: AccountProps;

  private constructor(props: AccountProps) {
    this.props = props;
  }

  static createNew(email: string, passwordHash: string, role: string): Account {
    const now = new Date();

    return new Account({
      id: "",
      email,
      password: passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: AccountProps): Account {
    return new Account(props);
  }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
