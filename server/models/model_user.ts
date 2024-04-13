import { DataTypes, Model } from "sequelize";
import sequelize from "../models";

interface UserAttributes {
  Uid: string;
  UserName: string;
  ProfileId: string;
  ProfileMsg: string;
  PhotoUrl: string;
  Follower: number;
  Followee: number;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>(
  "User",
  {
    Uid: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    ProfileId: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    ProfileMsg: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    PhotoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Follower: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    Followee: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;
