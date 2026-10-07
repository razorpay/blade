"""
Cuts one of Blade's faces from a static instance: printable ASCII, ₹, and
the punctuation checkout's copy uses all the time; kerning only. With --rupee, adds the ₹ drawn by rupee.py (TASA has none).
Run by build.sh:

  python3 subset.py INSTANCE.ttf OUT.ttf "Full Name" PostScriptName WEIGHT [--rupee rupee-ff.ttf]
"""
import sys
from fontTools.ttLib import TTFont, newTable
from fontTools import subset
from fontTools.pens.ttGlyphPen import TTGlyphPen

source, out, full_name, ps_name, weight = sys.argv[1:6]
rupee = sys.argv[sys.argv.index('--rupee') + 1] if '--rupee' in sys.argv else None

# Printable ASCII and only what checkout's copy shows all the time and Arial
# draws visibly wrong beside TASA or Inter; anything else is the system's.
WANTED = list(range(0x20, 0x7F)) + [
  0x20B9,                          # ₹
  0x2018, 0x2019, 0x201C, 0x201D,  # ‘ ’ “ ” — apostrophes in copy
  0x2013, 0x2014,                  # – —
  0x2026, 0x2022, 0xB7,            # … • ·
  0xA0,                            # no-break space (formatted amounts)
]

font = TTFont(source)
cmap = font.getBestCmap()
missing = [cp for cp in WANTED if cp not in cmap and not (cp == 0x20B9 and rupee)]
if missing:
    print(f'{out}: not in the design, left to the fallback:', ' '.join(f'U+{cp:04X}' for cp in missing))

opts = subset.Options()
opts.layout_features = ['kern', 'cpsp']
# The sources carry no glyph hinting, only gasp/prep (smooth at every size): keep those.
opts.hinting = True
opts.notdef_outline = True
opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
opts.drop_tables += ['DSIG', 'STAT', 'fvar', 'gvar', 'avar', 'HVAR', 'MVAR']
subsetter = subset.Subsetter(opts)
subsetter.populate(unicodes=[cp for cp in WANTED if cp in cmap])
subsetter.subset(font)

if rupee:
    drawn = TTFont(rupee)
    source_glyph = drawn.getBestCmap()[0x20B9]
    pen = TTGlyphPen(None)
    drawn.getGlyphSet()[source_glyph].draw(pen)
    glyph = pen.glyph()
    order = font.getGlyphOrder() + ['rupee']
    font.setGlyphOrder(order)
    font['glyf'].glyphOrder = order
    font['glyf'].glyphs['rupee'] = glyph
    glyph.recalcBounds(font['glyf'])
    font['hmtx']['rupee'] = (drawn['hmtx'][source_glyph][0], glyph.xMin)
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[0x20B9] = 'rupee'
    font['maxp'].numGlyphs = len(order)

if 'gasp' not in font:
    # Smooth (grayscale and ClearType, symmetric) at every size, as checkout's files ask.
    gasp = newTable('gasp')
    gasp.gaspRange = {0xFFFF: 0x000F}
    font['gasp'] = gasp

for record in list(font['name'].names):
    if record.nameID in (1, 4):
        record.string = full_name
    elif record.nameID == 2:
        record.string = 'Regular'
    elif record.nameID == 6:
        record.string = ps_name
font['OS/2'].usWeightClass = int(weight)
font.save(out)
print(out, len(font.getBestCmap()), 'characters')
