import { useMesssagesContext } from "@/contexts/MessagesContext";
import type { GifItemData } from "@/interfaces";

export default function GifItem({GIF}: {GIF: GifItemData}) {
  const { setGIF } = useMesssagesContext();

  return <div onClick={() => setGIF(GIF)} className="cursor-pointer mb-4 break-inside-avoid overflow-hidden rounded-xl hover:opacity-50">
    <img className="block w-full h-auto" src={GIF.url} />
  </div>
}
