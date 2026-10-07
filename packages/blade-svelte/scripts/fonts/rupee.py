"""
Draws ₹ for the heading face — TASA Orbiter has none — from its own parts:
P's bowl, E's bar thickness, R's stroke weight for the leg. Run by build.sh
with FontForge (`fontforge -lang=py -script rupee.py`), in its work folder.
"""
import fontforge, psMat
f = fontforge.open('instance.ttf')
f.encoding = 'UnicodeFull'

def rect(x0, y0, x1, y1):
    c = fontforge.contour(True)
    c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.lineTo(x1, y0); c.closed = True
    return c

def poly(points):
    c = fontforge.contour(True)
    c.moveTo(*points[0])
    for p in points[1:]: c.lineTo(*p)
    c.closed = True
    return c

BAR = 106            # E's and P's bar thickness
LEFT, RIGHT = 40, 524
BOWL = 480           # the bowl's outer edge: narrower than the bars, which run past it
ADVANCE = 560        # the digits' advance: ₹ lines up with tabular figures

# P's bowl without its stem (x 51–169), moved so its outer edge lands at BOWL
tmp = f.createChar(-1, 'bowltmp')
tmp.foreground = f[ord('P')].foreground.dup()
keep = rect(171, -20, 800, 720)
layer_tmp = tmp.foreground; layer_tmp += keep; tmp.foreground = layer_tmp
tmp.intersect()
print('bowl bbox', [round(v) for v in tmp.boundingBox()])
bowl = tmp.foreground.dup()
bowl.transform(psMat.translate(BOWL - 543, 0))
arm_left = 171 + (BOWL - 543)          # where the bowl's arms now begin

g = f.createChar(0x20B9, 'rupee')
g.clear()
layer = fontforge.layer(); layer.is_quadratic = True
for contour in bowl: layer += contour
layer += rect(LEFT, 680 - BAR, RIGHT, 680)                 # top bar
mid = (680 - BAR + 347) / 2                                 # centred between the top bar and the bowl's lower arm
layer += rect(LEFT, mid - BAR / 2, RIGHT, mid + BAR / 2)   # middle bar
layer += rect(LEFT, 243, arm_left + 10, 347)                # the lower arm, out to the left edge
# The leg: R's stroke weight (118 across), from the arm's left end to the bottom right
slope, width = 0.945, 162
layer += poly([(LEFT, 347), (LEFT + width, 347), (RIGHT + 6, 0), (RIGHT + 6 - width, 0)])
g.foreground = layer
g.removeOverlap()
# Square every part off at the left edge: the bowl's arms reach past it.
clip = g.foreground; clip += rect(LEFT, -20, 600, 720); g.foreground = clip
g.intersect()
g.correctDirection(); g.round(); g.simplify(); g.round()
g.width = ADVANCE
print('bbox', [round(v) for v in g.boundingBox()], 'contours', len(g.foreground))
f.removeGlyph('bowltmp')
f.generate('rupee-ff.ttf', flags=('opentype',))
