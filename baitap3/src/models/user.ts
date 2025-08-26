import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Khai báo các thuộc tính của User
export interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: boolean;
    image: string;
    roleId: string;
    positionId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Khi tạo mới, có thể bỏ qua id, createdAt, updatedAt
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> { }

// Định nghĩa model User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public address!: string;
    public phoneNumber!: string;
    public gender!: boolean;
    public image!: string;
    public roleId!: string;
    public positionId!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // định nghĩa mối quan hệ ở đây
    }
}

// Hàm khởi tạo model
export default (sequelize: Sequelize) => {
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            phoneNumber: {
                type: DataTypes.STRING,
            },
            gender: {
                type: DataTypes.BOOLEAN,
            },
            image: {
                type: DataTypes.STRING,
            },
            roleId: {
                type: DataTypes.STRING,
            },
            positionId: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "Users", // Sequelize khuyến nghị đặt rõ tableName
        }
    );

    return User;
};
