import React, {useEffect, useState} from 'react';
import { Menu, Layout, Dropdown, Badge, Avatar, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
    UserOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    HomeOutlined,
    ShopOutlined,
    LogoutOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    ReadOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from  '../routes/AuthContext'
import apiClient from "../services/api";
import {UsersResponseDto} from "../@type/UserResponseDto";
import {getProfile} from "../api/profile.api";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, logout, user } = useAuth();
    const [userProfile, setUserProfile] = useState<UsersResponseDto | null>(null);
    useEffect(() => {
        const fetchProfile = async () => {
            if (!isLoggedIn) {
                setUserProfile({ FirstName: "", LastName: "", AvatarUrl: null });
                return;
            }

            try {
                const res = await getProfile();
                if (res.success && res.data) {
                    setUserProfile(res.data);
                } else {
                    setUserProfile({ FirstName: "", LastName: "", AvatarUrl: null });
                }
            } catch (err) {
                console.log("Failed to fetch profile", err);
                setUserProfile({ FirstName: "", LastName: "", AvatarUrl: null });
            }
        };

        fetchProfile();
    }, [isLoggedIn]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await apiClient.get('/cart');

                if (res.data && Array.isArray(res.data.data)) {
                    const total = res.data.data.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                    );
                    setCartCount(total);
                }
            } catch (error) {
                console.error("Get cart error:", error);
            }
        };

        fetchCart();

        const handleCartUpdate = () => {
            fetchCart();
        };
        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, [])



    const [wishlistCount, setWishlistCount] = useState(0);
    useEffect(() => {
        const updateWishlistCount = () => {
            const savedWishlist = JSON.parse(localStorage.getItem("Wishlist") || "[]");
            setWishlistCount(savedWishlist.length);
        };
        updateWishlistCount();
        window.addEventListener("wishlistUpdated", updateWishlistCount);
        return () => {
            window.removeEventListener("wishlistUpdated", updateWishlistCount);
        };
    }, []);

    const menuItems = [
        { 
            key: '/', 
            label: 'Home',
            icon: <HomeOutlined />,
        },
        { 
            key: '/shop', 
            label: 'Shop',
            icon: <ShopOutlined />,
        },
        { 
            key: '/about', 
            label: 'About Us',
            icon: <InfoCircleOutlined />,
        },
        { 
            key: '/contact', 
            label: 'Contact',
            icon: <PhoneOutlined />,
        },
        { 
            key: '/blog', 
            label: 'Blog',
            icon: <ReadOutlined />,
        },
        {
            key: '/faqs',
            label: 'FAQ',
            icon: <InfoCircleOutlined />,
        }
    ];
    const userMenuItems: MenuProps['items'] = isLoggedIn
        ? [
            ...(user?.role === 'Admin' || user?.role === 'Employee' ? [
                {
                    key: 'dashboard',
                    label: 'Dashboard',
                    icon: <DashboardOutlined />,
                    onClick: () => navigate('admin/dashboard'),
                },
                { type: 'divider' as const, key: 'divider-admin' },
            ] : []),
            {
                key: 'profile',
                label: "Profile",
                icon: <UserOutlined />,
                onClick: () => navigate('/profile'),
            },
            {
                key: 'orders',
                label: 'My Orders',
                icon: <ShoppingCartOutlined />,
                onClick: () => navigate('/myorders'),
            },
            { type: 'divider' as const, key: 'divider-1' },
            {
                key: 'logout',
                label: <Text type="danger">Logout</Text>,
                icon: <LogoutOutlined style={{ color: 'red' }} />,
                onClick: handleLogout,
            },
        ]
        : [
            {
                key: 'login',
                label: 'Login',
                onClick: () => navigate('/login'),
            },
            {
                key: 'register',
                label: 'Register',
                onClick: () => navigate('/register'),
            },
        ];


    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #f0f0f0',
        height: '70px',
    };

    const headerContentStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        maxWidth: '1400px',
    };

    const logoStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    };

    const logoTextStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 700,
        background: 'linear-gradient(45deg, #1890ff, #722ed1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginLeft: '8px',
        letterSpacing: '-0.5px',
    };

    const menuStyle: React.CSSProperties = {
        flex: 1,
        justifyContent: 'center',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        fontSize: '15px',
        fontWeight: 500,
    };

    const iconsContainerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    };

    const iconStyle: React.CSSProperties = {
        fontSize: '20px',
        cursor: 'pointer',
        color: '#595959',
        transition: 'all 0.3s ease',
        padding: '8px',
        borderRadius: '6px',
    };

    const activeIconStyle: React.CSSProperties = {
        ...iconStyle,
        color: '#1890ff',
        backgroundColor: '#f6ffed',
    };

    return (
        <AntHeader style={headerStyle}>
            <div style={headerContentStyle}>
            {/* Logo Section */}
            <div 
                style={logoStyle}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    }}
                >
                    S
                </div>
                <span style={logoTextStyle}>SHRADHA</span>
            </div>

            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={(e) => navigate(e.key)}
                style={menuStyle}
                className="custom-menu"
            />

            {/* Action Icons */}
            <div style={iconsContainerStyle}>

                <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                    arrow={{ pointAtCenter: true }}
                >
                    {isLoggedIn ? (
                        <Avatar
                            size={36}
                            src={userProfile?.avatarUrl || undefined} // nếu có ảnh thì hiển thị
                            icon={!userProfile?.avatarUrl && <UserOutlined />} // nếu chưa có ảnh thì hiển thị icon
                            style={{
                                cursor: 'pointer',
                                backgroundColor: !userProfile?.avatarUrl ? '#1890ff' : undefined,
                                border: '2px solid #f0f7ff',
                            }}
                        />
                    ) : (
                        <UserOutlined
                            style={{
                                ...iconStyle,
                                fontSize: '18px',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#1890ff';
                                e.currentTarget.style.backgroundColor = '#f0f7ff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#595959';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        />
                    )}
                </Dropdown>


                {/* Wishlist Icon */}
                <Badge count={wishlistCount} showZero={false}>
                    <HeartOutlined
                        style={location.pathname === '/wishlist' ? activeIconStyle : iconStyle}
                        onClick={() => navigate('/wishlist')}
                        onMouseEnter={(e) => {
                            if (location.pathname !== '/wishlist') {
                                e.currentTarget.style.color = '#ff4d4f';
                                e.currentTarget.style.backgroundColor = '#fff2f0';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== '/wishlist') {
                                e.currentTarget.style.color = '#595959';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    />
                </Badge>

                {/* Shopping Cart Icon */}
                <Badge count={cartCount} size="small" offset={[-3, 3]}>
                    <ShoppingCartOutlined
                        style={location.pathname === '/cart' ? activeIconStyle : iconStyle}
                        onClick={() => navigate('/cart')}
                        onMouseEnter={(e) => {
                            if (location.pathname !== '/cart') {
                                e.currentTarget.style.color = '#52c41a';
                                e.currentTarget.style.backgroundColor = '#f6ffed';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== '/cart') {
                                e.currentTarget.style.color = '#595959';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    />
                </Badge>
            </div>

            {/* Custom CSS for Menu Hover Effects */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .custom-menu .ant-menu-item:hover {
                        color: #1890ff !important;
                        background-color: #f0f7ff !important;
                        border-radius: 6px !important;
                    }
                    
                    .custom-menu .ant-menu-item-selected {
                        color: #1890ff !important;
                        background-color: #e6f7ff !important;
                        border-radius: 6px !important;
                    }
                    
                    .custom-menu .ant-menu-item-selected::after {
                        border-bottom: 2px solid #1890ff !important;
                    }
                    
                    .custom-menu .ant-menu-item {
                        margin: 0 4px !important;
                        border-radius: 6px !important;
                        transition: all 0.3s ease !important;
                    }
                `
            }} />
            </div>
        </AntHeader>
    );
};

export default Header;