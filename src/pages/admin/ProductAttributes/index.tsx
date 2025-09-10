// src/pages/admin/ManageIndex.tsx
import { Tabs, Card, Typography } from "antd";
import {
    AppstoreOutlined,
    BookOutlined,
} from "@ant-design/icons";
import FactoryIcon from '@mui/icons-material/Factory';
import CategoryTab from "./tabs/CategoryTab";
import PublisherTab from "./tabs/PublisherTab";
import ManufacturerTab from "./tabs/ManufacturerTab";

const { Title } = Typography;

const ManageIndex = () => {
    const items = [
        {
            key: "category",
            label: (
                <span>
          <AppstoreOutlined /> Category
        </span>
            ),
            children: <CategoryTab />,
        },
        {
            key: "publisher",
            label: (
                <span>
          <BookOutlined /> Publisher
        </span>
            ),
            children: <PublisherTab />,
        },
        {
            key: "manufacturer",
            label: (
                <span>
          <FactoryIcon  /> Manufacturer
        </span>
            ),
            children: <ManufacturerTab />,
        },
    ];

    return (
        <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
            <Card
                bordered={false}
                style={{
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                <Title
                    level={3}
                    style={{ marginBottom: 20, textAlign: "center", fontWeight: 600 }}
                >
                    Manage Product Attributes
                </Title>
                <Tabs
                    defaultActiveKey="category"
                    items={items}
                    tabBarStyle={{
                        fontWeight: 500,
                    }}
                />
            </Card>
        </div>
    );
};

export default ManageIndex;
