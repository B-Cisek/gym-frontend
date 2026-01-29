import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: "data",
      source: "index.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        seo: z
          .object({
            title: z.string(),
            description: z.string(),
          })
          .optional(),
        navigation: z.boolean().optional(),
        hero: z.object({
          links: z.array(
            z.object({
              label: z.string(),
              icon: z.string().optional(),
              trailing: z.boolean().optional(),
              to: z.string(),
              target: z.string().optional(),
              size: z.string().optional(),
              color: z.string().optional(),
              variant: z.string().optional(),
            }),
          ),
        }),
        sections: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            id: z.string().optional(),
            orientation: z.string().optional(),
            reverse: z.boolean().optional(),
            features: z.array(
              z.object({
                name: z.string(),
                description: z.string(),
                icon: z.string(),
              }),
            ),
          }),
        ),
        features: z.object({
          title: z.string(),
          description: z.string(),
          items: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              icon: z.string(),
            }),
          ),
        }),
        testimonials: z.object({
          headline: z.string(),
          title: z.string(),
          description: z.string(),
          items: z.array(
            z.object({
              quote: z.string(),
              user: z.object({
                name: z.string(),
                description: z.string(),
                avatar: z.object({
                  src: z.string(),
                }),
              }),
            }),
          ),
        }),
        cta: z.object({
          title: z.string(),
          description: z.string(),
          links: z.array(
            z.object({
              label: z.string(),
              to: z.string(),
              target: z.string().optional(),
              trailingIcon: z.string().optional(),
              variant: z.string().optional(),
              icon: z.string().optional(),
            }),
          ),
        }),
      }),
    }),
    pricing: defineCollection({
      type: "data",
      source: "pricing.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        seo: z
          .object({
            title: z.string(),
            description: z.string(),
          })
          .optional(),
        "navigation.icon": z.string().optional(),
        plans: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            price: z.object({
              month: z.string(),
              year: z.string(),
            }),
            button: z.object({
              label: z.string(),
              color: z.string().optional(),
              variant: z.string().optional(),
            }),
            features: z.array(z.string()),
            highlight: z.boolean().optional(),
            scale: z.boolean().optional(),
          }),
        ),
        logos: z
          .object({
            title: z.string(),
            icons: z.array(z.string()),
          })
          .optional(),
        faq: z
          .object({
            title: z.string(),
            description: z.string(),
            items: z.array(
              z.object({
                label: z.string(),
                content: z.string(),
              }),
            ),
          })
          .optional(),
      }),
    }),
    changelog: defineCollection({
      source: "changelog.json",
      type: "page",
    }),
    versions: defineCollection({
      source: "changelog/**/*",
      type: "page",
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string(),
        date: z.date(),
        image: z.string(),
      }),
    }),
  },
});
