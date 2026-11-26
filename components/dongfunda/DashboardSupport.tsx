import support from '@/lib/dongfunda/dashboard-support.json';

/** Include in the topbar after topic navigation and before the report tag. */
export default function DashboardSupport() {
  return <><link rel="stylesheet" href="/dongfunda-assets/shared/dashboard-support.css" /><div style={{display:'contents'}} dangerouslySetInnerHTML={{__html: support.html}} /></>;
}
