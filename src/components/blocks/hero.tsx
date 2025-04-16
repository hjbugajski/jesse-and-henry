import { PayloadImage } from '@/components/ui/payload-image';
import type { PayloadHeroBlock } from '@/payload/payload-types';

export function HeroBlock({ image, titleOne, titleTwo, subtitle }: PayloadHeroBlock) {
  return (
    <div className="mx-auto w-full max-w-7xl md-lg:px-4">
      <div className="relative flex h-[768px] w-full justify-center overflow-clip md-lg:rounded-3xl sm:h-[1024px] md:justify-start lg:h-[825px]">
        {typeof image !== 'string' ? (
          <PayloadImage
            {...image}
            loading="eager"
            className="min-h-full w-full object-cover object-center"
          />
        ) : null}
        <div className="absolute top-0 right-0 left-0 flex h-fit w-full flex-1 flex-col items-center justify-center gap-6 bg-neutral-99/50 p-6 text-center backdrop-blur-md md:top-8 md:left-8 md:max-w-xs md:rounded-xl md:p-8">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <h1 className="text-4xl tracking-[0.5rem] md:text-5xl">{titleOne}</h1>
            <div className="flex w-full flex-row items-center justify-center gap-8 font-serif text-2xl md:text-3xl">
              <span className="w-full border-t border-t-neutral-10/80" />
              &
              <span className="w-full border-t border-t-neutral-10/80" />
            </div>
            <h1 className="text-4xl tracking-[0.5rem] md:text-5xl">{titleTwo}</h1>
          </div>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
