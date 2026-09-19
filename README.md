# Icon Studio — website

Product photography studio, Kolkata. Founder: Anushree.

Plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

```
index.html          Home
services.html       Services
portfolio.html      Work / portfolio
about.html          About Anushree
pricing.html        Pricing
contact.html        Contact + enquiry form
css/style.css       All styling
js/script.js        All behaviour + site configuration
README.md           This file
```

---

## 1. How to run the website

**Quickest way** — double-click `index.html`. It opens in your browser and everything
works, including the menu, filters, FAQ and enquiry form.

**Better way while editing** — run a small local server so links and refreshes behave
exactly like the live site. In Terminal, from this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

**Putting it online** — upload the whole folder, keeping the structure, to any static
host (Netlify, Vercel, GitHub Pages, Hostinger, cPanel). There is nothing to install or
compile.

---

## 2. Where to add images

Every photograph slot is an `<img>` tag with an **empty `src`**. Each one has a comment
above it saying what belongs there:

```html
<!-- IMAGE: Beauty — skincare range, packshot with texture detail -->
<div class="frame frame--4x5"><img src="" alt="Skincare product photography" loading="lazy"></div>
```

To add a photo:

1. Make a folder called `images/` next to `index.html` and put the files in it.
2. Fill in the `src`: `<img src="images/skin-01.jpg" alt="...">`
3. Update the `alt` text to describe the photo. This matters for Google and for screen
   readers — describe the product and the category, e.g.
   `alt="Gold ring photographed on a dark surface"`.

**Keep the aspect ratio class.** The `frame--*` class on the wrapper controls the shape of
the slot, and the photo is cropped to fill it:

| Class          | Shape        | Used for                   |
|----------------|--------------|----------------------------|
| `frame--1x1`   | Square       | Packshots, detail crops    |
| `frame--4x5`   | Portrait     | Most portfolio work        |
| `frame--3x4`   | Taller       | Jewellery, fashion         |
| `frame--3x2`   | Landscape    | Food, lifestyle            |
| `frame--16x10` | Wide         | Hero and lifestyle         |
| `frame--16x9`  | Wider        | Video stills               |
| `frame--21x9`  | Panoramic    | Full-width statement shots |

Until a `src` is added the slot shows as a quiet grey block — that is intentional, and no
broken-image icon appears.

**Image sizes.** Export at roughly twice the display size (e.g. 1600px wide for a
half-width image), as JPEG at 70–80% quality. Keep individual files under ~400KB so pages
stay fast.

**Share image for WhatsApp/social.** In every page's `<head>` there is
`<meta property="og:image" content="">`. Add a 1200×630 JPEG URL there once the site has a
domain.

---

## 3. Where to change the WhatsApp number

**One place only** — the top of `js/script.js`:

```js
const SITE_CONFIG = {
  whatsappNumber: "91XXXXXXXXXX",   // <- country code + number, digits only
  ...
};
```

Example for a Kolkata mobile: `"919830000000"`. No `+`, no spaces, no dashes.

This single value powers the floating WhatsApp button on every page, every "WhatsApp" link
in the footer and menu, and the enquiry form.

The pre-filled message that opens with the floating button is just below it:

```js
const WHATSAPP_DEFAULT_MESSAGE = "Hi Icon Studio, I'd like to enquire about a product shoot.";
```

---

## 4. Where to change the Instagram URL

Same block in `js/script.js`:

```js
instagramUrl: "https://www.instagram.com/your-handle/",
```

Every Instagram link on the site picks it up. While it is left as `"#"` the links simply
do nothing.

---

## 5. Where to change contact information

Same block in `js/script.js`:

```js
email: "hello@iconstudio.in",
phone: "+91 98300 00000",
location: "Kolkata, West Bengal, India",
```

- Leave `email` or `phone` as `""` and those lines **hide themselves** on the contact page
  and in the footer. Nothing looks unfinished.
- Filling them in turns them into working `mailto:` and `tel:` links automatically.

Two other places worth updating when the details are confirmed:

- **`index.html` → the `<script type="application/ld+json">` block.** This is the Google
  business listing data. Add `"telephone"`, `"email"`, `"image"` and a `"sameAs"` array
  with the Instagram URL. Do not add ratings or reviews unless they are real.
- **Every page `<head>`** — replace `https://example.com/` in the `canonical` and
  `og:url` tags with the real domain.

---

## 6. Where to edit portfolio projects

`portfolio.html`, inside `<div class="gallery">`. Each project is one block:

```html
<article class="gallery__item is-seven" data-category="beauty" data-reveal>
  <div class="work__head">
    <h2 class="work__title">Melt</h2>
    <span class="caption">01 / Beauty</span>
  </div>
  <div class="frame frame--4x5"><img src="" alt="..." loading="lazy"></div>
  <div class="work__foot">
    <p class="work__note">Short line about the project.</p>
    <span class="caption">Studio</span>
  </div>
</article>
```

- **`data-category`** must be one of: `beauty`, `jewellery`, `food`, `fashion`,
  `lifestyle`, `ecommerce`, `campaign`. This is what the filter buttons use. A project can
  have two, separated by a space: `data-category="beauty campaign"`.
- **Width classes** create the asymmetric layout: `is-wide` (full width), `is-seven`,
  `is-five`, `is-half`, `is-third`. Add `is-drop` to push an item further down the page.
- Keep mixing widths and `frame--*` ratios — that variety is what stops the page looking
  like a grid of thumbnails.
- The project names (Melt, Form, Table, Object 01…) are placeholders. Replace them with
  real project or brand names when you have permission to use them.
- To add a new category, add one more `<button class="filter" data-filter="yourname">` in
  the filter bar and use the same value in `data-category`.

The homepage has five shorter project blocks in `index.html` under
`<!-- PROJECTS: ... -->`. Same idea, different layout classes (`work__item--a` to
`work__item--e`).

---

## 7. Where to update pricing

Nothing on the site quotes a rupee figure, on purpose.

- **`pricing.html`** — the three `<article class="plan">` blocks (Essential, Creative,
  Campaign) and the twelve "what moves the number" factors above them. If you decide to
  publish starting prices, replace the `Quoted per project` lines inside each plan.
- **`index.html`** — the shorter pricing teaser, in the `<div class="tiers">` block. The
  line to change there is `Starting from — enquire`.
- **Budget ranges in the enquiry form** — `contact.html`, the `<select id="f-budget">`
  options.

---

## 8. Where to update founder information

`about.html` is entirely about Anushree.

- The first-person copy is a **starting draft** — there is an HTML comment near the top of
  the file saying so. It should be rewritten in Anushree's own words before the site goes
  live.
- No awards, client names, years of experience or credentials are claimed anywhere. If you
  add them, make sure they are accurate.
- Her photographs go in the two image slots: the wide one below the title and the portrait
  one in the "Working with Anushree" section.
- `index.html` also has a shorter founder section (search for `08 — FOUNDER`), and the
  `"founder"` entry in the JSON-LD block at the top of that file.

---

## Other things worth knowing

**Testimonials.** The three quotes on the homepage are placeholders, marked
`<!-- REPLACE WITH REAL CLIENT TESTIMONIAL -->`, and attributed to "Client name — Brand,
category". Replace them with real quotes and real names, or delete the whole
`10 — TESTIMONIALS` section. Do not publish the placeholders as if they were real.

**Privacy and Terms.** The two links in the footer point to `#`. Create `privacy.html` and
`terms.html` when the copy exists and update those links.

**Colours, type and spacing** live at the very top of `css/style.css` under `:root`. Change
`--accent` in one place to change every accent detail on the site.

**Adding a page.** Copy any existing page, change the `<title>`, the meta description, the
canonical URL, and add `aria-current="page"` to the matching nav link. The header, mobile
menu, footer and WhatsApp button are the same block of HTML on every page.

**What runs on the page.** A fixed header that hides on scroll down, a full-screen mobile
menu, category hover previews on the homepage, portfolio filtering, FAQ accordions,
fade-in-on-scroll, a page fade between links, and the enquiry form. All of it respects the
system "reduce motion" setting.
