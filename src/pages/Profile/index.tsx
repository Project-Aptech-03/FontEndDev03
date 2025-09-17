import { useEffect, useState } from "react";
import { Card, message } from "antd";
import { UsersResponseDto } from "../../@type/UserResponseDto";
import { getProfile } from "../../api/profile.api";
import { useNavigate } from "react-router-dom";

import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import { ApiResponse } from "../../@type/apiResponse";
import {useAuth} from "../../routes/AuthContext";

const Profile: React.FC = () => {
    const [user, setUser] = useState<UsersResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfile();
                if (res.success && res.data) {
                    setUser(res.data);
                } else {
                    message.error(res.message || "Lỗi khi tải thông tin user");
                }
            } catch (err: any) {
                const apiError = err?.response?.data as ApiResponse<UsersResponseDto>;
                if (apiError?.errors) {
                    Object.values(apiError.errors)
                        .flat()
                        .forEach((msg: string) => message.error(msg));
                } else {
                    message.error(apiError?.message || "Lỗi hệ thống không xác định");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <p>Đang tải thông tin...</p>;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                display: "flex",
                justifyContent: "center",
                padding: "40px",
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 950,
                    borderRadius: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
                bodyStyle={{ padding: 0 }}
            >
                <div
                    style={{
                        height: 200,
                        backgroundImage: `url("/assets/image/backgroundLogin.jpg")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <ProfileHeader user={user!} />

                <ProfileTabs
                    user={user!}
                    navigate={navigate}
                    handleLogout={handleLogout}
                />


            </Card>
        </div>
    );
};

export default Profile;
