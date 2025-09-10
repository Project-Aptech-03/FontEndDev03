import React, { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const AdminFAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    { id: 1, question: "Làm thế nào để đặt hàng?", answer: "Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ và tiến hành thanh toán." },
    { id: 2, question: "Thời gian giao hàng bao lâu?", answer: "Thời gian giao hàng từ 2-5 ngày tùy khu vực." },
  ]);

  const [newFAQ, setNewFAQ] = useState<FAQItem>({ id: 0, question: "", answer: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFAQ((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) return;
    setFaqs((prev) => [
      ...prev,
      { ...newFAQ, id: prev.length + 1 }
    ]);
    setNewFAQ({ id: 0, question: "", answer: "" });
  };

  const handleDeleteFAQ = (id: number) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  return (
    <div className="admin-faq">
      <h1>⚙️ Quản lý FAQ</h1>

      <div className="faq-form">
        <input
          type="text"
          name="question"
          placeholder="Nhập câu hỏi"
          value={newFAQ.question}
          onChange={handleChange}
        />
        <textarea
          name="answer"
          placeholder="Nhập câu trả lời"
          value={newFAQ.answer}
          onChange={handleChange}
          rows={3}
        />
        <button onClick={handleAddFAQ}>Thêm FAQ</button>
      </div>

      <table className="faq-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Câu hỏi</th>
            <th>Trả lời</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr key={faq.id}>
              <td>{faq.id}</td>
              <td>{faq.question}</td>
              <td>{faq.answer}</td>
              <td>
                <button onClick={() => handleDeleteFAQ(faq.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFAQ;
