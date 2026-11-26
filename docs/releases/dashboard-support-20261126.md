# Company dashboard support buttons

Every new DongFunda company dashboard should include the YouTube and coffee membership buttons in its topbar, between Pipeline/topic navigation and the ONE REPORT tag. On narrow screens the buttons wrap into their own row inside the same sticky topbar. Keep the dashboard public; these buttons are optional support links. Do not add a separate support card in the page content.

- New React dashboards: render `components/dongfunda/DashboardSupport.tsx`.
- BDMS's approved HTML renderer uses the same `lib/dongfunda/dashboard-support.json` through `scripts/prerender-bdms.cjs`; retain its support placeholder.
- Shared responsive styles: `public/dongfunda-assets/shared/dashboard-support.css`.
- Channel: https://www.youtube.com/@DongFunda
- Membership: https://www.youtube.com/channel/UCXwMXJiAI_oJKiBB7UC8v0Q/join
- Owner-provided copy: สมัครสมาชิกเลี้ยงกาแฟ 50 บาท/เดือน.
- Both links open a separate tab with noopener/noreferrer. No purchase or subscription is made by the website.

Change the shared JSON for future wording or destination changes, then regenerate BDMS HTML and build.
