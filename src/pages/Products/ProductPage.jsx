import { useEffect, useState } from "react";
import { ProductService } from "../../services/productService.js";
import ProductForm from "../../Compoments/ProductForm.jsx";


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // ✅ lưu sản phẩm đang sửa
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getAll();
      setProducts(response.data || []);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setEditingProduct(null);
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditingProduct(product);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await ProductService.delete(id);
        await fetchProducts();
      } catch {
        alert("Lỗi khi xóa sản phẩm.");
      }
    }
  };

  return (
      <div className="product-list-container">
        <div className="product-list-header">
          <h2>Danh sách sản phẩm</h2>
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Thêm sản phẩm
          </button>
        </div>

        {loading ? (
            <p>Đang tải dữ liệu...</p>
        ) : (
            <div className="table-container">
              <table className="product-table">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Mô tả</th>
                  <th>Ảnh</th>
                  <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {products.length > 0 ? (
                    products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.price}</td>
                          <td>{p.description}</td>
                          <td>
                            {p.imageUrl ? (
                                <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    style={{ width: 60, height: 40, objectFit: "cover" }}
                                />
                            ) : (
                                "Không có ảnh"
                            )}
                          </td>
                          <td>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleEditClick(p)}
                            >
                              Sửa
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(p.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không có sản phẩm nào.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
        )}

        {showModal && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h3>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>
                <ProductForm
                    product={editingProduct}
                    onCancel={() => setShowModal(false)}
                    onSaveSuccess={() => {
                      fetchProducts();
                      setShowModal(false);
                      setEditingId(null);
                      setEditingProduct(null);
                    }}
                />
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductPage;
