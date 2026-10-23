import { LinkifyText } from '@/components/shared/LinkifyText';

export default function PlanningHeroCopy({ title, heading, highlight }: {
  title: string;
  heading?: string;
  highlight?: string;
}) {
  return (
    <>
      <h1 className="font-display text-[30px] min-[701px]:text-[48px] font-bold tracking-normal leading-[1.4] min-[701px]:leading-[1.3] mx-auto mb-5 max-w-[1050px]">
        {title}
      </h1>
      {heading && (
        <p className="text-[21px] min-[701px]:text-[26px] leading-[1.55] text-blue-300 font-semibold max-w-[1000px] mx-auto mb-[18px]">
          <LinkifyText text={heading} />
        </p>
      )}
      {highlight && (
        <p className="text-base min-[701px]:text-lg leading-[1.8] text-slate-300 max-w-[950px] mx-auto mb-6">
          <LinkifyText text={highlight} />
        </p>
      )}
    </>
  );
}
