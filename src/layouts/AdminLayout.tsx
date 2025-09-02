import { Layout, Menu } from "antd";
import { Outlet, Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/admin/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/admin/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/admin/coupons">Coupons</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 20px" }}>
          <h2>Admin Panel</h2>
        </Header>
        <Content style={{ padding: "20px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
