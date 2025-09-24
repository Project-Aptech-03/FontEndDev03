import { Tabs } from "antd";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import { UsersResponseDto } from "../../@type/UserResponseDto";

import OrderTab from "./tabs/OrderTab";
import React from "react";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import {useNavigate} from "react-router-dom";

const { TabPane } = Tabs;
interface Props {
    user: UsersResponseDto;
    navigate: ReturnType<typeof useNavigate>;
    handleLogout: () => void;
}

const ProfileTabs: React.FC<Props> = ({ user, handleLogout, navigate }) => {
    return (
        <div style={{ padding: "24px" }}>
            <Tabs defaultActiveKey="1">
                <TabPane
                    tab={
                        <span>
        <UserOutlined /> Personal Information
      </span>
                    }
                    key="1"
                >
                    <PersonalInfoTab
                        user={user}
                        navigate={navigate}
                        handleLogout={handleLogout}
                    />
                </TabPane>

                <TabPane
                    tab={
                        <span>
        <ShoppingOutlined /> Orders History
      </span>
                    }
                    key="2"
                >
                    <OrderTab />
                </TabPane>

            </Tabs>


        </div>
    );
};

export default ProfileTabs;
