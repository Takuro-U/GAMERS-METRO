import { DataTypes, Sequelize, Model } from "sequelize";
import sequelize from "../models";

interface RoomAttributes {
  Id: string;
  Uid1: string;
  Uid2: string;
}

interface RoomInstance extends Model<RoomAttributes>, RoomAttributes {}

const Room = sequelize.define<RoomInstance>(
  "Room",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Uid1: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Uid2: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
  },
  {
    tableName: "rooms",
    timestamps: false,
  }
);

export default Room;
