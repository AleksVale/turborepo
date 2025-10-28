export interface RoleProps {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  private props: RoleProps;

  private constructor(props: RoleProps) {
    this.props = props;
  }

  static create(props: Omit<RoleProps, 'createdAt' | 'updatedAt'>): Role {
    return new Role({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: RoleProps): Role {
    return new Role(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
}
