import support from '@/lib/dongfunda/dashboard-support.json';

/** Include below the introduction on each new company dashboard. */
export default function DashboardSupport() {
  return <><link rel="stylesheet" href="/dongfunda-assets/shared/dashboard-support.css" /><div dangerouslySetInnerHTML={{__html: support.html}} /></>;
}
