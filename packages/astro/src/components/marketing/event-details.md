---
title: Event Details (Astro)
description: The facts of an event (date, time, venue, fee) and the registration action on a Sheet panel, beside the description and the programme.
---

## When to use

- Use `EventDetails` under a `PageIntro` on an event page: a briefing, a launch, a consultation session.
- Use `NewsList` to list events, and `ContactLocations` under it for how to reach the organisers.

## Usage

The default slot is the description; `Prose` styles it:

```astro
---
import EventDetails from "@/components/blocks/event-details.astro";
import Prose from "@/components/ui/prose.astro";
import GlobeIcon from "@/components/ui/icons/globe.astro";
---

<EventDetails
  aboutTitle="Mengenai taklimat ini"
  date="Khamis, 12 November 2026"
  time="9.00 pagi hingga 1.00 petang"
  venue="Dewan Perdana, Kompleks Kementerian Kewangan, Putrajaya"
  fee="Percuma"
  extra={[{ label: "Bahasa", value: "Bahasa Melayu", icon: GlobeIcon }]}
  registerAction={{ label: "Daftar sekarang", href: "/daftar" }}
  registerNote="Pendaftaran ditutup pada 5 November."
  mapHref="https://maps.google.com/?q=Kementerian+Kewangan+Putrajaya"
  programme={[
    { time: "9.00 pagi", title: "Ucapan alu-aluan", detail: "Ketua Setiausaha Perbendaharaan" },
    { time: "9.30 pagi", title: "Apa yang berubah untuk perniagaan" },
    { time: "11.00 pagi", title: "Sesi soal jawab" },
  ]}
>
  <Prose>
    <p>Taklimat setengah hari tentang perubahan cukai dan bantuan dalam Belanjawan 2027.</p>
  </Prose>
</EventDetails>
```

## Notes

- Write `date`, `time` and `fee` as people read them ("Khamis, 12 November 2026", "Percuma"); they are shown as given, not formatted.
- The facts are a description list with built-in labels in the page's language. `extra` adds rows after them, such as the language or the dress code; its `icon` is an icon component, passed unsized.
- On desktop the facts panel sits on the right and stays in view as people scroll; on phones it comes first, above the description.
- `registerAction` is the one filled button; the `actions` slot replaces it. `mapHref` adds a "Dapatkan arah" / "Get directions" link, and the `aside` slot takes notes under the facts, such as parking or access.
- The programme is an ordered list of times and sessions under "Atur cara" / "Programme" (`programmeTitle`). `aboutTitle` heads the description; leave it unset for none.
- Templates in `packages/astro/src/templates` that use it: `event.astro`.
