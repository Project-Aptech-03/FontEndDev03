import React from "react";
import { Card, Typography, Row, Col, Divider, Space } from "antd";
import dayjs from "dayjs";
import { UsersResponseDto } from "../../../@type/UserResponseDto";
import ProfileActions from "../ProfileActions";
import { useNavigate } from "react-router-dom";
import {
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface Props {
    user: UsersResponseDto;
    navigate: ReturnType<typeof useNavigate>;
    handleLogout: () => void;
}

const PersonalInfoTab: React.FC<Props> = ({ user, navigate, handleLogout }) => {
    return (
        <Card
            style={{
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                padding: 24,
                background: "#fff",
            }}
            bodyStyle={{ padding: 0 }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Divider style={{ margin: "12px 0" }}>Personnal Information</Divider>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Text>
                            <MailOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                            {user.email}
                        </Text>
                        <Text>
                            <PhoneOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                            {user.phoneNumber || "-"}
                        </Text>
                        <Text>
                            <CalendarOutlined style={{ color: "#faad14", marginRight: 8 }} />
                            {user.dateOfBirth
                                ? dayjs(user.dateOfBirth).format("YYYY-MM-DD")
                                : "-"}
                        </Text>
                        <Text>
                            <HomeOutlined style={{ color: "#eb2f96", marginRight: 8 }} />
                            {user.address || "-"}
                        </Text>
                    </Space>
                </Col>

                <Col span={24} style={{ marginTop: 16 }}>
                    <Divider style={{ margin: "12px 0" }} />
                    <ProfileActions navigate={navigate} handleLogout={handleLogout} />
                </Col>
            </Row>
        </Card>
    );
};

export default PersonalInfoTab;
