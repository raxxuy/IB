import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BackButton({
  action,
}: {
  action?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="bg-white max-w-fit p-2 rounded-md shadow-lg">
      <button
        onClick={action ?? (() => router.back())}
        className="flex items-center"
      >
        <Image
          src="/arrow-back.svg"
          alt="Back"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      </button>
    </div>
  );
}