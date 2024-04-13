import { DataTypes, Sequelize, Model } from "sequelize";
import sequelize from "../models";

interface CommentAttributes {
  Id: string;
  ParentId: string;
  Uid: string;
  Text: string;
  Timestamp: any;
  TimestampEdit: any;
}

interface CommentInstance extends Model<CommentAttributes>, CommentAttributes {}

const Comment = sequelize.define<CommentInstance>(
  "Comment",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ParentId: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    Uid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Text: {
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
    tableName: "comments",
    timestamps: false,
  }
);

export default Comment;
