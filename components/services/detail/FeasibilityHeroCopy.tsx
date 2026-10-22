import { LinkifyText } from '@/components/shared/LinkifyText';

export default function FeasibilityHeroCopy({ heading, highlight }: { heading?: string; highlight?: string }) {
  return (
    <>
      <h1 className="font-display text-[30px] md:text-5xl font-bold tracking-normal leading-[1.35] md:leading-[1.25] mb-4">
        รับทำ Feasibility Study
      </h1>
      <p className="text-[21px] md:text-[28px] leading-[1.45] font-semibold text-blue-300 mt-3 mb-5">
        ศึกษาความเป็นไปได้และความคุ้มค่าก่อนลงทุน
      </p>
      <p className="text-base md:text-lg leading-[1.8] text-gray-200 max-w-[850px] mx-auto">
        Feasibility Study คือการศึกษาความเป็นไปได้ของโครงการ โดยเชื่อมข้อมูลตลาด รายได้ ต้นทุน เงินลงทุน และกระแสเงินสด เพื่อประเมินความคุ้มค่าและความเสี่ยงภายใต้สมมติฐานก่อนตัดสินใจลงทุน
      </p>
      <p className="text-sm md:text-base leading-[1.8] text-slate-300 mt-[18px] max-w-[850px] mx-auto">
        {heading && <LinkifyText text={heading} />}
        {heading && highlight && <br />}
        {highlight && <LinkifyText text={highlight} />}
      </p>
    </>
  );
}
