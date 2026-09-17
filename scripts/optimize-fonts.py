"""Generate WOFF2 fonts for the site's Latin text; requires fonttools and brotli.

Original TTF files remain unchanged. Include extended Latin, punctuation,
trademark and euro characters used by the website.
"""
from pathlib import Path
from fontTools import subset

options = subset.Options()
options.flavor = "woff2"
for path in Path("public/assets").glob("font-*.ttf"):
    font = subset.load_font(str(path), options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=list(range(0x250)) + list(range(0x2000, 0x2070)) + [0x2122, 0x20AC])
    subsetter.subset(font)
    subset.save_font(font, str(path.with_suffix(".woff2")), options)
