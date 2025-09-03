import api from './api';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFAQDto {
  question: string;
  answer: string;
  displayOrder: number;
}

export interface UpdateFAQDto {
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export const faqService = {
  // Lấy tất cả FAQ (cho admin) - ĐÃ SỬA: bỏ header thủ công
  getAllFaqs: async (): Promise<FAQ[]> => {
    const response = await api.get('/faq/all'); 
    return response.data;
  },

  // Lấy FAQ active (cho khách hàng)
  getActiveFaqs: async (): Promise<FAQ[]> => {
    const response = await api.get('/faq');
    return response.data;
  },

  // Lấy FAQ theo ID
  getFaqById: async (id: number): Promise<FAQ> => {
    const response = await api.get(`/faq/${id}`);
    return response.data;
  },

  // Tạo FAQ mới
  createFaq: async (faqData: CreateFAQDto): Promise<FAQ> => {
    const response = await api.post('/faq', faqData);
    return response.data;
  },

  // Cập nhật FAQ
  updateFaq: async (id: number, faqData: UpdateFAQDto): Promise<FAQ> => {
    const response = await api.put(`/faq/${id}`, faqData);
    return response.data;
  },

  // Xóa FAQ
  deleteFaq: async (id: number): Promise<void> => {
    await api.delete(`/faq/${id}`);
  },

  // Toggle trạng thái FAQ
  toggleFaqStatus: async (id: number, isActive: boolean): Promise<FAQ> => {
    const faq = await faqService.getFaqById(id);
    const updateData: UpdateFAQDto = {
      question: faq.question,
      answer: faq.answer,
      displayOrder: faq.displayOrder,
      isActive: isActive
    };
    return await faqService.updateFaq(id, updateData);
  }


  
};

export default faqService;