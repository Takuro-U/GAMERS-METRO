import { DataTypes, Model } from "sequelize";
import sequelize from "../models";

interface FollowAttributes {
  Id: string;
  Follower: string;
  Followee: string;
}

interface FollowInstance extends Model<FollowAttributes>, FollowAttributes {}

const Follow = sequelize.define<FollowInstance>(
  "Follow",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Follower: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Followee: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
  },
  {
    tableName: "follow",
    timestamps: false,
  }
);

export default Follow;
