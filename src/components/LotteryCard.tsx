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
     {
        imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={200}
            className="object-cover"
          />
        )
 
     }

{/* <Image
        src={imageUrl}
        alt={title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      /> */}
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-green-600 font-semibold">${price} / Ticket</p>
          <p className="text-xs text-gray-400">{new Date(drawDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default LotteryCard;
