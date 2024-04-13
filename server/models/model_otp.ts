import { DataTypes, Model } from "sequelize";
import sequelize from "../models";

interface OtpAttributes {
  Id: string;
  Email: string;
  ProfileId: string;
  OneTimePass: string;
}

interface OtpInstance extends Model<OtpAttributes>, OtpAttributes {}

const Otp = sequelize.define<OtpInstance>(
  "Otp",
  {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ProfileId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },

    OneTimePass: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "otp",
    timestamps: false,
  }
);

export default Otp;
