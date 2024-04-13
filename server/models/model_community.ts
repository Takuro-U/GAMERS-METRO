import { DataTypes, Sequelize, Model } from "sequelize";
import sequelize from "../models";

interface CommunityAttributes {
  Id: string;
  Uid: string;
  Text: string;
  Img1: string;
  Img2: string;
  Img3: string;
  Img4: string;
  Timestamp: any;
  TimestampEdit: any;
}

interface CommunityInstance
  extends Model<CommunityAttributes>,
    CommunityAttributes {}

const Community = sequelize.define<CommunityInstance>(
  "Community",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Uid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    Text: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    Img1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Img2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Img3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Img4: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: "community",
    timestamps: false,
  }
);

export default Community;
