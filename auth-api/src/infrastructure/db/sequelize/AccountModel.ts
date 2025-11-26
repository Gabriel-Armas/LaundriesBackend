import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../sequelize/sequelize";

export interface AccountAttributes {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AccountCreationAttributes = Optional<
  AccountAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class AccountModel
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AccountModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "EMPLOY",
    },
  },
  {
    sequelize,
    tableName: "accounts",
    modelName: "Account",
  }
);
