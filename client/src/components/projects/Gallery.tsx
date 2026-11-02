import { useCallback, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Lightbox } from '@/components/ui/Lightbox';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

interface Props {
  images: string[];
  name: string;
}

export function Gallery({ images, name }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const open = (i: number, el: HTMLElement) => {
    trigger.current = el;
    setIndex(i);
  };

  // Return focus to the thumbnail that opened the lightbox
  const close = useCallback(() => {
    setIndex(null);
    trigger.current?.focus();
  }, []);

  if (!images.length) return null;

  return (
    <>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <StaggerItem key={src}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`Open screenshot ${i + 1} of ${images.length} for ${name}`}
              className="bento group relative block aspect-[16/10] w-full overflow-hidden"
            >
              <img
                src={src}
                alt={`${name} screenshot ${i + 1}`}
                width={1280}
                height={800}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-bg/80 text-fg">
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <Lightbox images={images} index={index} onClose={close} onChange={setIndex} label={name} />
    </>
  );
}