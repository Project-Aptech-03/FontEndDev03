import { Card, Button, Typography, Image } from "antd";

const { Title, Text } = Typography;

interface ProductCardProps {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  title,
  price,
  description,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card
      className="max-w-md mx-auto"
      cover={
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-8">
          <Image
              src={imageUrl || "/placeholder.svg"}
              width={300}
              height={300}
              style={{ objectFit: "contain" }}
              preview={false}
          />

        </div>
      }
      bordered={false}
    >
      <div className="text-center space-y-4">
        <Title
          level={3}
          className="!mb-2 !text-gray-800 !font-medium tracking-wide"
        >
          {title}
        </Title>

        <Title level={2} className="!mb-4 !text-gray-900 !font-normal">
          {price}
        </Title>

        <Text className="text-gray-600 block mb-8">{description}</Text>

        <Button
          type="primary"
          size="large"
          className="w-full !h-12 !bg-white !text-gray-800 !border-gray-800 hover:!bg-gray-50"
          onClick={onAddToCart}
        >
          ADD TO CART
        </Button>
      </div>
    </Card>
  );
}

