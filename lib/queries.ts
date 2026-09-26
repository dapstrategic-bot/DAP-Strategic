// GROQ queries for Sanity CMS

// ดึงข้อมูล services ทั้งหมดที่ isActive = true เรียงตาม order
export const servicesQuery = `
  *[_type == "service" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    subtitle,
    problem,
    solution,
    deliverables,
    order
  }
`;

// ดึงข้อมูล service ตาม slug (หน้ารายละเอียด)
export const serviceBySlugQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "category": category->{ title, slug },
    hero {
      badge,
      heading,
      highlight,
      subheading,
      painPoints[] {
        text
      },
      videoPreview,
      "thumbnailUrl": thumbnail.asset->url
    },
    sections[] {
      _type,
      _type == "solutionSection" => {
        heading,
        description
      },
      _type == "benefitSection" => {
        benefits[] {
          title,
          description
        }
      },
      _type == "storySection" => {
        heading,
        content,
        "imageUrl": image.asset->url
      },
      _type == "socialProofSection" => {
        title,
        description,
        "socialImages": socialImages[]{ "url": asset->url }
      }
    },
    subtitle,
    description,
    problem,
    solution,
    deliverables,
    suitableFor,
    faqs,
    isActive,
    seo
  }
`;

// ดึง slug ทั้งหมดสำหรับ generateStaticParams สำหรับ service
export const serviceSlugsQuery = `
  *[_type == "service" && isActive == true] { "slug": slug.current }
`;

// ดึงข้อมูล portfolio ที่ isActive = true เรียงตาม order
export const portfolioQuery = `
  *[_type == "portfolio" && isActive == true] | order(order asc) {
    _id,
    title,
    description,
    result,
    "category": service->title,
    "imageUrl": image.asset->url,
    order
  }
`;

// ดึงข้อมูล siteSettings สำหรับ Footer
export const siteSettingsQuery = `
  *[_id == "siteSettings"][0] {
    companyName,
    contact {
      email,
      lineUrl,
      address
    },
    socialLinks[] {
      platform,
      url
    },
    footerTagline,
    "logoUrl": logo.asset->url
  }
`;

// ดึงข้อมูล homePage
export const homePageQuery = `
  *[_id == "homePage"][0] {
    hero {
      badge,
      heading,
      highlight,
      description
    },
    valueProps[] {
      title,
      description
    },
    stats[] {
      value,
      label,
      subLabel
    },
    cta {
      heading,
      description
    },
    seo {
      title,
      description
    }
  }
`;

// ดึงข้อมูล products ที่ isActive = true เรียงตาม order (listing)
export const productsQuery = `
  *[_type == "product" && isActive == true] | order(order asc) {
    _id,
    title,
    slug,
    "category": category->{ title, slug },
    subtitle,
    description,
    "imageUrl": image.asset->url,
    badge,
    order
  }
`;

// ดึงข้อมูล product ตาม slug (หน้ารายละเอียด)
export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "category": category->{ title, slug },
    hero {
      badge,
      heading,
      highlight,
      subheading,
      painPoints[] {
        text
      },
      videoPreview,
      "thumbnailUrl": thumbnail.asset->url
    },
    sections[] {
      _type,
      _type == "solutionSection" => {
        heading,
        description
      },
      _type == "benefitSection" => {
        benefits[] {
          title,
          description
        }
      },
      _type == "storySection" => {
        heading,
        content,
        "imageUrl": image.asset->url
      },
      _type == "socialProofSection" => {
        title,
        description,
        "socialImages": socialImages[]{ "url": asset->url }
      }
    },
    subtitle,
    description,
    features,
    suitableFor,
    faqs,
    originalPrice,
    salePrice,
    bookingPrice,
    badge,
    "imageUrl": image.asset->url,
    ctaLink,
    bookingLink,
    paymentOptions {
      "purchase": purchase-> {
        _id,
        heading,
        steps[] {
          description,
          "imageUrl": image.asset->url
        }
      },
      "booking": booking-> {
        _id,
        heading,
        steps[] {
          description,
          "imageUrl": image.asset->url
        }
      }
    },
    isActive,
    seo
  }
`;

// ดึง slug ทั้งหมดสำหรับ generateStaticParams
export const productSlugsQuery = `
  *[_type == "product" && isActive == true] { "slug": slug.current }
`;

// ดึงข้อมูล productsPage
export const productsPageQuery = `
  *[_id == "productsPage"][0] {
    hero,
    solution,
    benefitsSection,
    productsSection,
    cta,
    seo
  }
`;

// ดึงข้อมูล servicesPage
export const servicesPageQuery = `
  *[_id == "servicesPage"][0] {
    hero,
    cta,
    seo
  }
`;

// ดึงข้อมูล aboutPage
export const aboutPageQuery = `
  *[_id == "aboutPage"][0] {
    story {
      badge,
      heading,
      description,
      visionTitle,
      visionDescription,
      "imageUrl": image.asset->url,
      stats
    },
    philosophy,
    contact,
    seo
  }
`;
