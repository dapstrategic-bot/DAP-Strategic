import {
  safeLink,
  videoEmbed,
  type ContentBlock,
  type DongFundaContent,
} from '@/lib/dongfunda/model';
import { Thumbnail } from './ContentCard';

export function ArticleBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        if (block.kind === 'video') {
          const embed = videoEmbed(block.url);
          return embed ? (
            <section key={block._key}>
              {block.heading && <h2>{block.heading}</h2>}
              <iframe
                className="df-video"
                src={embed}
                title={block.heading || 'DongFunda video'}
                loading="lazy"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </section>
          ) : null;
        }
        if (block.kind === 'image')
          return block.image?.url ? (
            <figure key={block._key}>
              <Thumbnail
                item={
                  {
                    title:
                      block.image.alt || block.heading || 'ภาพประกอบบทความ',
                    thumbnail: block.image,
                  } as DongFundaContent
                }
              />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          ) : null;
        if (block.kind === 'quote')
          return (
            <blockquote key={block._key}>
              {block.text}
              {block.caption && <cite>{block.caption}</cite>}
            </blockquote>
          );
        if (block.kind === 'financial_table')
          return (
            <section key={block._key}>
              {block.heading && <h2>{block.heading}</h2>}
              <div
                className="df-financial-table"
                tabIndex={0}
                role="region"
                aria-label={block.heading || 'ตารางข้อมูล'}
              >
                <table>
                  {block.caption && <caption>{block.caption}</caption>}
                  <thead>
                    <tr>
                      {block.columns?.map((column, i) => (
                        <th key={i} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row) => (
                      <tr key={row._key}>
                        {row.cells.map((cell, i) =>
                          i === 0 ? (
                            <th key={i} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={i}>{cell}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {block.source && (
                <p className="df-source">แหล่งข้อมูล: {block.source}</p>
              )}
            </section>
          );
        if (block.kind === 'chart') {
          const points = (block.points || []).filter((p) =>
            Number.isFinite(p.value),
          );
          const max = Math.max(1, ...points.map((p) => Math.abs(p.value)));
          return (
            <section key={block._key}>
              {block.heading && <h2>{block.heading}</h2>}
              <figure className="df-chart">
                <div aria-label={block.heading || 'กราฟข้อมูล'}>
                  {points.map((point) => (
                    <div className="df-chart-row" key={point._key}>
                      <span>{point.label}</span>
                      <div className="df-chart-track">
                        <div
                          className="df-chart-bar"
                          style={{
                            width: `${(Math.abs(point.value) / max) * 100}%`,
                            background: point.value < 0 ? '#b75b52' : undefined,
                          }}
                        />
                      </div>
                      <span>{point.value.toLocaleString('th-TH')}</span>
                    </div>
                  ))}
                </div>
                <figcaption>
                  {block.unit && <span>หน่วย: {block.unit}. </span>}
                  {block.caption}
                  {block.source && ` · แหล่งข้อมูล: ${block.source}`}
                </figcaption>
              </figure>
            </section>
          );
        }
        if (block.kind === 'cta') {
          const href = safeLink(block.url);
          return href ? (
            <section key={block._key}>
              {block.heading && <h2>{block.heading}</h2>}
              {block.text && <p style={{whiteSpace: 'pre-line'}}>{block.text}</p>}
              <a className="df-button df-button-primary" href={href}>
                {block.label || 'ดูรายละเอียด'}
              </a>
            </section>
          ) : null;
        }
        return (
          <section
            key={block._key}
            className={
              block.kind === 'key_takeaways' ? 'df-takeaways' : undefined
            }
          >
            {block.heading && <h2>{block.heading}</h2>}
            {block.text && <p style={{whiteSpace: 'pre-line'}}>{block.text}</p>}
            {!!block.items?.length && (
              <ul>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {block.source && (
              <p className="df-source">
                แหล่งอ้างอิง: {safeLink(block.url) ? <a href={safeLink(block.url)} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>{block.source}</a> : block.source}
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}
