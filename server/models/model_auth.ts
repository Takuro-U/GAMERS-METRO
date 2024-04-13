import { DataTypes, Model } from "sequelize";
import sequelize from "../models";

interface AuthAttributes {
  Uid: string;
  ProfileId: string;
  Email: string;
  PasswordHashed: string;
}

interface AuthInstance extends Model<AuthAttributes>, AuthAttributes {}

const Auth = sequelize.define<AuthInstance>(
  "Auth",
  {
    Uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ProfileId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    PasswordHashed: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "auth",
    timestamps: false,
  }
);

export default Auth;
