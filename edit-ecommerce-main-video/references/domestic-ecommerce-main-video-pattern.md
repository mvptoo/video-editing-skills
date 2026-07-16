# Domestic Ecommerce Main Video Pattern

Use this reference when the user asks to repeat an approved domestic ecommerce main-video style, especially for wearable, outdoor, sun-protection, cycling, hiking, or functional accessory products.

## Approved Style

- Public product wording: use the public-facing category or product name confirmed by the user.
- Treat SKU, factory model codes, and internal project names as private unless the user says they are public-facing.
- HyperFrames composition: 900x1200 for 3:4 output.
- No blurred extension background.
- No visible side borders.
- Full-frame `object-fit: cover`.
- Start wearable footage with `object-position: center top`; adjust per shot to preserve head, hands, product fit, and detail.
- White lower-left labels with soft shadow.
- Selling-point labels enter with GSAP from x -44, y 18, opacity 0, scale 0.98, about 0.48s.
- Sporty or dynamic synthetic BGM, or user-provided licensed music.
- Original video audio muted.
- Logo-only clean outro.

## Timing Template

```text
0.0-2.4   Hero: public category or product label
2.2-5.2   Core benefit or pain point
5.0-10.0  Functional proof scene
10.0-13.0 Mechanism or detail close-up
13.0-16.0 Fit, adjustment, texture, or material detail
16.0-19.2 Target-use scene
19.2-21.0 Logo-only outro
```

## CSS Pattern

```css
.scene-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.fg-video {
  object-fit: cover;
  object-position: center top;
}

.label {
  position: absolute;
  left: 58px;
  bottom: 112px;
  max-width: 720px;
  color: #f8fbf7;
  font-size: 58px;
  line-height: 1.16;
  font-weight: 800;
  text-shadow:
    0 4px 18px rgba(20, 32, 24, 0.7),
    0 1px 2px rgba(20, 32, 24, 0.9);
}
```

## Verification

Run:

```bash
npx hyperframes lint
npx hyperframes validate
npx hyperframes inspect --samples 12
ffprobe -v error -show_entries format=duration,size -show_streams -of json "<output.mp4>"
```

Extract frames at 1s, the functional proof segment, the detail segment, and the outro. Check for cropped faces, hidden product details, unreadable text, accidental borders, unmuted source audio, and unsupported claims.
