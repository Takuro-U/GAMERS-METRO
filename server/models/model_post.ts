import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../models";

interface PostAttributes {
  Id: string;
  Uid: string;
  GameTitle: string;
  PostTitle: string;
  Member: number;
  PostMsg: string;
  Timestamp: any;
  TimestampEdit: any;
}

interface PostInstance extends Model<PostAttributes>, PostAttributes {}

const Post = sequelize.define<PostInstance>(
  "Post",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Uid: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    GameTitle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    PostTitle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    Member: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PostMsg: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    Timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    TimestampEdit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "posts",
    timestamps: false,
  }
);

export default Post;
