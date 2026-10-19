import { videoEmbed, type DongFundaContent } from '@/lib/dongfunda/model';
export const bdmsChapters = [
  {
    "time": "00:00",
    "seconds": 0,
    "label": "กราฟราคา BDMS และสัญญาณ RSI",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=0"
  },
  {
    "time": "00:41",
    "seconds": 41,
    "label": "แนวทางจัดพอร์ตและหุ้น Defensive",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=41"
  },
  {
    "time": "01:50",
    "seconds": 110,
    "label": "ภาพรวมงบการเงินและความถูกแพงของ BDMS",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=110"
  },
  {
    "time": "05:01",
    "seconds": 301,
    "label": "อ่าน One Report และทิศทางธุรกิจสุขภาพ",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=301"
  },
  {
    "time": "08:09",
    "seconds": 489,
    "label": "รายได้ กำไร และตัวชี้วัดธุรกิจโรงพยาบาล",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=489"
  },
  {
    "time": "12:07",
    "seconds": 727,
    "label": "โครงสร้างรายได้จากการรักษาพยาบาล",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=727"
  },
  {
    "time": "13:16",
    "seconds": 796,
    "label": "การใช้เตียงและผู้ป่วยไทย–ต่างชาติ",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=796"
  },
  {
    "time": "17:16",
    "seconds": 1036,
    "label": "กลยุทธ์เติบโต เทคโนโลยี และแผนขยายบริการ",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=1036"
  },
  {
    "time": "22:05",
    "seconds": 1325,
    "label": "อ่านรายได้ กำไร และฤดูกาลของผลประกอบการ",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=1325"
  },
  {
    "time": "26:52",
    "seconds": 1612,
    "label": "สินทรัพย์ กำไรสะสม และสมการบัญชี",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=1612"
  },
  {
    "time": "30:31",
    "seconds": 1831,
    "label": "ความเสี่ยงจากหนี้สินและสภาพคล่อง",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=1831"
  },
  {
    "time": "32:28",
    "seconds": 1948,
    "label": "กระแสเงินสด การลงทุน และเงินปันผล",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=1948"
  },
  {
    "time": "38:43",
    "seconds": 2323,
    "label": "ประเมินมูลค่าด้วย P/E และ Margin of Safety",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=2323"
  },
  {
    "time": "40:50",
    "seconds": 2450,
    "label": "อ่านมุมมองนักวิเคราะห์และทำความเข้าใจ DCF",
    "url": "https://youtu.be/wkLXOQQ3lLc?t=2450"
  }
] as const;
// Fail closed to the original renderer if content identity or approved chapters change.
export function canUseBdmsWatch(item: DongFundaContent): boolean {
  const blocks = item.content_blocks || [];
  const chapters = blocks.filter(block => /^chapter-\d+$/.test(block._key));
  return !item.demo && item.slug === 'bdms-beginner-business-financial-statements-valuation'
    && item.content_id === 'DF-CX-20261012-BDMS-BEGINNER-LF01'
    && item.canonical_url === 'https://www.dap.co.th/dongfunda/bdms-beginner-business-financial-statements-valuation'
    && videoEmbed(item.video_embed || item.video_url) === 'https://www.youtube-nocookie.com/embed/wkLXOQQ3lLc'
    && blocks.filter(block => /^section-[0-3]$/.test(block._key) && block.heading && block.text).length === 4
    && blocks.some(block => block._key === 'approved-description' && !!block.text)
    && !blocks.some(block => block._key === 'context')
    && chapters.length === bdmsChapters.length
    && bdmsChapters.every((chapter, index) => chapters[index]?._key === `chapter-${index}` && chapters[index]?.url === chapter.url && chapters[index]?.label === `${chapter.time} ${chapter.label}`)
    && blocks.every(block => /^section-[0-3]$/.test(block._key) || /^chapter-\d+$/.test(block._key) || ['source-title', 'approved-description', 'chapters'].includes(block._key))
    && !!item.thumbnail?.url?.includes('5f3f816271229912e2f453c6cc3ae2c421e26936');
}
