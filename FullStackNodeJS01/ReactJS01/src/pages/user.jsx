import { message, notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../utils/api';

const UserPage = () => {
    const [dataSource, setDatasource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            console.log(res);
            if (res) {
                setDatasource(res);
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message,
                });
            }
        };

        fetchUser();
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 1 }}
            />
        </div>
    );
};

export default UserPage;