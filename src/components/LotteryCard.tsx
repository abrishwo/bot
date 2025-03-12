import Image from 'next/image';

interface LotteryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  drawDate: string;
  onClick: () => void;
}

const LotteryCard: React.FC<LotteryCardProps> = ({
  title,
  description,
  imageUrl,
  price,
  drawDate,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
    >
      <Image
        src={imageUrl}
        alt={title}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-green-600 font-semibold">${price} / Ticket</span>
          <span className="text-xs text-gray-400">{new Date(drawDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LotteryCard;
