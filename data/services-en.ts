export const englishServices = [
  {
    slug: 'business-plan', title: 'Business Plan',
    headline: 'A business plan that connects strategy with financial reality',
    description: 'Business planning for owners starting a business, expanding operations or preparing information for lenders and investors.',
    audience: 'For business owners who need a clear model, a practical operating plan and financial projections with traceable assumptions.',
    approach: 'We connect your customers, market, competitive positioning, revenue model and operations with investment, costs and cash flow. Existing results are separated from forecasts so that the plan can support a meaningful decision.',
    deliverables: ['Business plan covering the market, strategy, operations and finance', 'Excel financial model with documented assumptions', 'Executive summary and agreed presentation materials'],
    inputs: ['Business goals and intended use of funds', 'Products, customers, sales channels and competitive positioning', 'Available sales, costs, expenses, financial statements and cash records', 'Investment quotations, pricing, sales volumes and operating schedule', 'Existing funding, debt obligations and lender requirements, where available'],
    sections: [{title: 'Preparing a business plan for a loan application', paragraphs: [
      'Start with what the funds will be used for, when they are needed and which business cash flows could support the additional obligations. Do not set sales forecasts simply to match a desired loan amount.',
      'For an existing business, use available operating results and financial records. For a new business, distinguish verified information, such as supplier quotations, from assumptions about sales volumes and the start of revenue.',
      'Document requirements depend on the lender and loan product. Bring the requirements actually supplied by the lender so the scope can be tailored to the intended application.'
    ]}],
    faq: [
      ['Can we start before all information is available?', 'Yes. Begin with the decision you need to make and the information you already have. We identify gaps before agreeing on the scope rather than inventing missing figures.'],
      ['Does a business plan guarantee a loan?', 'No. Credit approval remains the lender’s decision. A business plan explains the business and its financial assumptions for review.'],
      ['Is a feasibility study always included?', 'Not automatically. A feasibility study tests viability; a business plan connects strategy, operations and finance. The agreed scope determines which work is included.'],
    ],
  },
  {
    slug: 'feasibility-study', title: 'Feasibility Study & Financial Model',
    headline: 'Understand viability, cash requirements and investment risks before committing',
    description: 'Project feasibility analysis connecting market assumptions, revenue, costs, investment and cash flow, including real estate and Pool Villa projects.',
    audience: 'For business owners, investors and landowners evaluating a new project, expansion, property development or a change in operating capacity.',
    approach: 'We build a financial model around evidence and clearly identified assumptions. Compare scenarios and assess cash requirements, break-even and investment indicators such as NPV, IRR and payback where appropriate to the agreed scope.',
    deliverables: ['Feasibility study report and executive summary', 'Excel financial model connecting investment, operations and cash flow', 'Scenario comparison, key risks and decision considerations'],
    inputs: ['Project concept, location and intended customers', 'Land, construction, equipment and fit-out estimates', 'Sale prices or rental assumptions, expected volumes and occupancy', 'Operating expenses, funding assumptions and payment schedules', 'Risks to test, such as delays, cost increases or slower sales'],
    sections: [
      {title: 'Real estate feasibility: Pool Villa development', paragraphs: [
        'Start with land costs, construction and fit-out, then compare revenue under the intended business model. A development for sale needs assumptions about sale prices and the timing of reservation payments, instalments and transfers. A rental project needs assumptions about rates, seasonal occupancy and operating expenses.',
        'Place receipts and payments on a timeline: land and construction payments may occur well before sales transfers or rental income. Test delayed completion, higher construction costs and lower revenue to identify additional funding needs and whether to proceed, resize or phase the project.',
        'DAP’s public portfolio includes Pool Villa work covering feasibility, business planning and project cash flow. This illustrates the type of work performed; it does not disclose client identities, confidential investment figures or realised returns.'
      ]},
      {title: 'Manufacturing financial models', paragraphs: [
        'Connect capital expenditure, production capacity, achievable sales, raw materials, labour, energy and fixed costs. Production capacity is not the same as expected sales.',
        'Model inventory, customer collection periods and supplier payment terms alongside investment and financing. A profitable business can still need working capital before customer cash is collected.',
        'Use scenarios to compare changes in prices, volumes, costs and investment timing. Strategic planning, valuation and loan-application work are agreed separately rather than assumed to be included in every model.'
      ]},
    ],
    faq: [
      ['How is feasibility different from a business plan?', 'Feasibility focuses on viability and investment economics under stated assumptions. A business plan also connects the market, strategy and operating model with finance. They can be scoped together.'],
      ['Can you assess a Pool Villa for sale or rent?', 'Yes. The revenue model, customer assumptions, costs and timing of cash receipts need to reflect whether the project is for sale, rental or a clearly defined combination.'],
      ['Does the analysis guarantee a return?', 'No. Forecasts depend on assumptions and actual execution. The analysis supports a decision and does not guarantee profit, investment returns or finance approval.'],
      ['What are the fees and lead time?', 'These depend on the scope, available evidence and intended use of the analysis. Share your initial information so we can prepare a project-specific proposal.'],
    ],
  },
  {
    slug: 'strategic-planner-business-strategy', title: 'Strategic Planning / Business Strategy',
    headline: 'Turn business priorities into a practical roadmap',
    description: 'Corporate strategy, growth priorities, KPIs and action planning for business owners who need a clear direction and coordinated execution.',
    audience: 'For businesses facing stalled growth, pressure on margins, unclear priorities or teams working without a shared direction.',
    approach: 'Review the business model, customers, capabilities, competitive position and financial constraints. Translate the findings into strategic priorities, measurable objectives and an action plan with responsibilities.',
    deliverables: ['Corporate strategy and growth priorities', 'Business Model Canvas or other agreed planning frameworks', 'Action plan, roadmap and agreed KPIs or OKRs'],
    inputs: ['Business objectives and management priorities', 'Products, customers, competitors and sales channels', 'Operating performance, financial information and constraints', 'Organisation structure, team responsibilities and available resources', 'Existing plans and issues that require management decisions'],
    sections: [{title: 'From analysis to execution', paragraphs: ['Start with the decisions that management needs to make. Identify the evidence available, the assumptions still to test and the trade-offs between growth, profitability and cash.', 'Assign responsibilities and review points to the agreed action plan. Ongoing implementation support and reporting can be scoped separately from the initial strategy engagement.']}],
    faq: [
      ['Is the strategy tailored to our business?', 'The scope is based on your objectives, business model, resources and available information. Frameworks organise the analysis rather than replace business-specific evidence.'],
      ['Does the engagement include ongoing management?', 'Only where expressly agreed. The proposal defines the planning work, deliverables, review rounds and any ongoing advisory support.'],
    ],
  },
] as const;
