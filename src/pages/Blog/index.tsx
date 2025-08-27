import React, { useState } from "react";
import { Card, Row, Col, Tag, Input, Select, Button, Avatar, Divider } from "antd";
import { SearchOutlined, CalendarOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
import "./BlogPage.css";

const { Search } = Input;
const { Option } = Select;

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  views: number;
  tags: string[];
}

const Blog: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock blog data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Reading: Digital Books vs Traditional Books",
      excerpt: "Explore the evolving landscape of reading habits and discover whether digital books or traditional paperbacks offer the best reading experience.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      readTime: "5 min read",
      views: 1247,
      tags: ["Digital Books", "Reading", "Technology"]
    },
    {
      id: 2,
      title: "Must-Read Books for 2024: Our Top Recommendations",
      excerpt: "Discover the most compelling books across fiction, non-fiction, and self-help genres that should be on your reading list this year.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Michael Chen",
      date: "2024-01-12",
      category: "Literature",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop",
      readTime: "8 min read",
      views: 892,
      tags: ["Book Reviews", "Recommendations", "2024"]
    },
    {
      id: 3,
      title: "Building Your Personal Library: A Complete Guide",
      excerpt: "Learn how to curate and organize your personal book collection, from choosing the right books to creating the perfect reading space.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      readTime: "6 min read",
      views: 1563,
      tags: ["Library", "Organization", "Lifestyle"]
    },
    {
      id: 4,
      title: "The Art of Book Collecting: Tips for Beginners",
      excerpt: "Start your journey as a book collector with expert advice on finding rare editions, preserving books, and building a valuable collection.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "David Kim",
      date: "2024-01-08",
      category: "Collecting",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
      readTime: "7 min read",
      views: 1034,
      tags: ["Book Collecting", "Rare Books", "Preservation"]
    },
    {
      id: 5,
      title: "Children's Books That Inspire: Educational Reading for Kids",
      excerpt: "Discover the best children's books that combine entertainment with education, helping young minds grow and develop through reading.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Lisa Wang",
      date: "2024-01-05",
      category: "Children",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
      readTime: "4 min read",
      views: 756,
      tags: ["Children's Books", "Education", "Reading"]
    },
    {
      id: 6,
      title: "Classic Literature: Timeless Books That Shaped History",
      excerpt: "Journey through the greatest works of literature that have stood the test of time and continue to influence readers across generations.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Alex Thompson",
      date: "2024-01-03",
      category: "Literature",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      readTime: "9 min read",
      views: 2341,
      tags: ["Classics", "Literature", "History"]
    }
  ];

  const categories = ["all", "Technology", "Literature", "Lifestyle", "Collecting", "Children"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="blog-container">
      {/* Header Section */}
      <div className="blog-header">
        <div className="blog-header-content">
          <h1 className="blog-title">Book Blog</h1>
          <p className="blog-subtitle">
            Discover the world of books through reviews, recommendations, and reading insights
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search articles..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: "100%" }}
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div className="filter-stats">
              <span>{filteredPosts.length} articles found</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Article */}
      {filteredPosts.length > 0 && (
        <div className="featured-article">
          <Card className="featured-card">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <div className="featured-image">
                  <img src={featuredPost.image} alt={featuredPost.title} />
                  <div className="featured-badge">Featured</div>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="featured-content">
                  <div className="featured-meta">
                    <Tag color="blue">{featuredPost.category}</Tag>
                    <span className="featured-date">
                      <CalendarOutlined /> {new Date(featuredPost.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="featured-title">{featuredPost.title}</h2>
                  <p className="featured-excerpt">{featuredPost.excerpt}</p>
                  <div className="featured-author">
                    <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredPost.author}`} />
                    <span>{featuredPost.author}</span>
                    <span className="read-time">{featuredPost.readTime}</span>
                  </div>
                  <Button type="primary" size="large" className="read-more-btn">
                    Read Full Article
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      {/* Articles Grid */}
      <div className="articles-section">
        <h2 className="section-title">Latest Book Reviews & Articles</h2>
        <Row gutter={[24, 24]}>
          {filteredPosts.slice(1).map(post => (
            <Col xs={24} sm={12} lg={8} key={post.id}>
              <Card
                hoverable
                className="article-card"
                cover={
                  <div className="article-image">
                    <img src={post.image} alt={post.title} />
                    <div className="article-overlay">
                      <Button type="primary" ghost>
                        Read More
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="article-meta">
                  <Tag color="blue">{post.category}</Tag>
                  <span className="article-date">
                    <CalendarOutlined /> {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="article-title">{post.title}</h3>
                <p className="article-excerpt">{post.excerpt}</p>
                <div className="article-footer">
                  <div className="article-author">
                    <Avatar size="small" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                    <span>{post.author}</span>
                  </div>
                  <div className="article-stats">
                    <span><EyeOutlined /> {post.views}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="article-tags">
                  {post.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <Card className="newsletter-card">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <h3>Stay Updated with Book News</h3>
              <p>Subscribe to our newsletter for the latest book reviews, reading recommendations, and literary insights delivered to your inbox.</p>
            </Col>
            <Col xs={24} md={8}>
              <div className="newsletter-form">
                <Input.Group compact>
                  <Input
                    placeholder="Enter your email"
                    size="large"
                    style={{ width: 'calc(100% - 100px)' }}
                  />
                  <Button type="primary" size="large">
                    Subscribe
                  </Button>
                </Input.Group>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
