#!/usr/bin/env python3
"""Generate GURBET 2026 raster brand assets (app icons + OG image) from the
new cream/burgundy/gold identity. Re-run to regenerate. Vector sources are the
*.svg files alongside; this script only produces the rasters HTML/manifest need.
"""
from PIL import Image, ImageDraw, ImageFont

CREAM   = (242, 237, 230)
BURG    = (122, 24, 21)
BURG_DK = (94, 18, 15)
GOLD    = (184, 146, 63)
GOLD_LT = (217, 184, 106)
INK     = (21, 17, 13)

SS = 4  # supersample factor

def serif(size, italic=False):
    # Didot: high-contrast Didone matching the brand sheet wordmark
    path = "/System/Library/Fonts/Supplemental/Didot.ttc"
    try:
        return ImageFont.truetype(path, size, index=1 if italic else 0)
    except Exception:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", size)

def rounded_tile(size, radius_frac, bg):
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(s * radius_frac)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=bg)
    return img, d, s

def draw_mark(d, s, ring=True, crescent_col=CREAM, ring_col=GOLD):
    """Crescent + sparkle monogram, centered in an s x s canvas."""
    cx, cy = s * 0.5, s * 0.52
    R = s * 0.30
    if ring:
        lw = max(2, int(s * 0.018))
        d.ellipse([cx - s*0.40, cy - s*0.40, cx + s*0.40, cy + s*0.40],
                  outline=ring_col, width=lw)
    # crescent = big disc minus offset disc
    cres = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cres)
    cd.ellipse([cx - R, cy - R, cx + R, cy + R], fill=crescent_col)
    off = R * 0.42
    cd.ellipse([cx - R + off*1.6, cy - R, cx - R + off*1.6 + 2*R, cy + R],
               fill=(0, 0, 0, 0))
    return cres, (cx, cy, R)

def sparkle(d, x, y, r, col):
    # 4-point sparkle (concave diamond)
    k = r * 0.34
    d.polygon([(x, y - r), (x + k, y - k), (x + r, y), (x + k, y + k),
               (x, y + r), (x - k, y + k), (x - r, y), (x - k, y - k)], fill=col)

def app_icon(size, bg=BURG, radius=0.22, crescent=CREAM, ring=GOLD, sp=GOLD_LT):
    img, d, s = rounded_tile(size, radius, bg)
    cres, (cx, cy, R) = draw_mark(d, s, ring=size >= 64, crescent_col=crescent, ring_col=ring)
    img.alpha_composite(cres)
    d = ImageDraw.Draw(img)
    if size >= 48:
        sparkle(d, cx + R * 0.72, cy - R * 0.78, R * 0.30, sp)
    return img.resize((size, size), Image.LANCZOS)

# ---- App / favicon icons -------------------------------------------------
app_icon(512).save("icon-512.png")
app_icon(192).save("icon-192.png")
app_icon(180).save("apple-touch-icon.png")
app_icon(64, radius=0.20).save("favicon-64.png")
ico32 = app_icon(32, radius=0.16)
ico16 = app_icon(16, radius=0.12)
ico32.save("favicon-32.png")
ico16.save("favicon-16.png")
ico32.save("favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("icons done")

# ---- OG / social share image (1200 x 630) --------------------------------
def og_image():
    W, H = 1200, 630
    s = SS
    img = Image.new("RGB", (W*s, H*s), CREAM)
    d = ImageDraw.Draw(img)
    # subtle burgundy frame
    m = int(40 * s)
    d.rounded_rectangle([m, m, W*s - m, H*s - m], radius=int(28*s),
                        outline=BURG, width=max(2, int(2*s)))
    # monogram top-center
    mk = Image.new("RGBA", (240*s, 240*s), (0, 0, 0, 0))
    md = ImageDraw.Draw(mk)
    cres, (cx, cy, R) = draw_mark(md, 240*s, ring=True, crescent_col=BURG, ring_col=GOLD)
    mk.alpha_composite(cres)
    md = ImageDraw.Draw(mk)
    sparkle(md, cx + R*0.72, cy - R*0.78, R*0.30, GOLD)
    img.paste(mk, (W*s//2 - 120*s, int(96*s)), mk)
    # wordmark
    f = serif(150*s)
    word = "GURBET"
    tw = d.textlength(word, font=f)
    d.text((W*s/2 - tw/2, 300*s), word, font=f, fill=INK)
    # gold rule
    rw = int(360 * s)
    ry = int(498 * s)
    d.line([W*s/2 - rw/2, ry, W*s/2 + rw/2, ry], fill=GOLD, width=max(1, int(2*s)))
    # tagline letter-spaced
    tf = serif(34*s)
    tag = "TÜRKİYE DROPS"
    spc = int(14 * s)
    widths = [d.textlength(ch, font=tf) for ch in tag]
    total = sum(widths) + spc * (len(tag) - 1)
    x = W*s/2 - total/2
    ty = int(516 * s)
    for ch, cw in zip(tag, widths):
        d.text((x, ty), ch, font=tf, fill=BURG)
        x += cw + spc
    img.resize((W, H), Image.LANCZOS).save("og-image.png")
    print("og-image done")

og_image()
