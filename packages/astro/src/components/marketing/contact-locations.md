---
title: Contact Locations (Astro)
description: How to reach an agency: the main contact channels (phone, email, hours, live chat) on Sheet cards, then the offices people can visit with address, hours and directions.
---

## When to use

- Use `ContactLocations` on a contact page, and at the end of a service or event page for where to ask.
- Use `Callout` for a temporary change, such as a closed office, above it.

## Usage

Either part can be left out:

```astro
---
import ContactLocations from "@/components/blocks/contact-locations.astro";
import Link from "@/components/ui/link.astro";
---

<ContactLocations
  description="Kami menjawab dalam masa dua hari bekerja."
  channels={[
    { kind: "phone", value: "03-8000 8000", detail: "Isnin hingga Jumaat, 8 pagi hingga 5 petang" },
    { kind: "email", value: "pertanyaan@mof.gov.my" },
    { kind: "chat", value: "Sembang dengan pegawai", href: "/sembang" },
  ]}
  officesTitle="Pejabat kami"
  offices={[
    {
      name: "Ibu pejabat, Putrajaya",
      address: ["Kompleks Kementerian Kewangan", "No. 5 Persiaran Perdana, Presint 2", "62592 Putrajaya"],
      phone: "03-8000 8000",
      hours: "Isnin hingga Jumaat, 8 pagi hingga 5 petang",
      mapHref: "https://maps.google.com/?q=Kementerian+Kewangan+Putrajaya",
    },
  ]}
>
  <Link href="/cawangan" primary>Semua cawangan</Link>
</ContactLocations>
```

## Notes

- A channel's `kind` (`phone`, `email`, `hours`, `chat`) picks its icon and default label in the page's language; `label` replaces it. Phone numbers and email addresses become `tel:` and `mailto:` links unless you give an `href`.
- Each office's details are an `<address>`. `mapHref` adds a directions link.
- The title defaults to "Hubungi kami" / "Contact us". `officesTitle` heads the offices when there are channels above them.
- The default slot sits under the offices, for a link to every branch.
- Templates in `packages/astro/src/templates` that use it: `contact.astro`, `event.astro` and `service-landing.astro`.
