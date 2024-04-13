import { DataTypes, Sequelize, Model } from "sequelize";
import sequelize from "../models";

interface MessageAttributes {
  Id: string;
  Message: string;
  ActiveUid: string;
  PassiveUid: string;
  RoomId: string;
  Timestamp: any;
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes {}

const Message = sequelize.define<MessageInstance>(
  "Message",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ActiveUid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    PassiveUid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    RoomId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "messages",
    timestamps: false,
  }
);

export default Message;
