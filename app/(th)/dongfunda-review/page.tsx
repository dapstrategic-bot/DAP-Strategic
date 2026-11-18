import { notFound } from 'next/navigation';
import Hub from '@/components/dongfunda/Hub';
import { demoEnabled } from '@/lib/dongfunda/model';
import '../dongfunda/dongfunda.css';

export const metadata = { robots: { index: false, follow: false } };
export default async function ReviewStates({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  if (!demoEnabled()) notFound();
  const { demoContent } = await import('@/lib/dongfunda/demo');
  const { state } = await searchParams;
  const items =
    state === 'empty'
      ? []
      : demoContent
          .slice(0, 3)
          .map((item, i) => ({
            ...item,
            thumbnail: undefined,
            title:
              i === 0
                ? 'การทำความเข้าใจงบการเงินและกระแสเงินสดของธุรกิจโรงพยาบาลสำหรับผู้เริ่มต้นลงทุนในระยะยาว'
                : i === 1
                  ? 'UnderstandingLongTermBusinessPerformanceAndCashFlowAcrossEconomicCycles'
                  : item.title,
          }));
  return <Hub items={items} product={null} services={[]} demo />;
}
