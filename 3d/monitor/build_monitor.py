"""
Brand-agnostic studio monitor for the Ondo Network "See it in action" scroll sequence.

Builds the whole scene from scratch (no downloaded model): aluminium body with bevelled edges,
black glass front with a thin bezel, the Ondo Perps UI on the screen, a slanted arm + flat base,
soft studio lights, transparent background with a shadow catcher.

Run headless (Blender 4.5):
  Blender -b --factory-startup --python build_monitor.py -- [options]

Options:
  --angle DEG        monitor turn around the vertical axis (−20 = screen faces left, 0 = front)
  --out PATH         render a single still to PATH (png)
  --frames N         render a sequence of N frames from −20° to 0° into --seq-dir
  --seq-dir DIR      output folder for the sequence (frame_000.png …)
  --scale PCT        resolution percentage of 1187×870 (default 50)
  --samples N        Cycles samples (default 48)
  --save PATH        save the .blend
  --gpu              use the Metal GPU (Apple Silicon Macs)
  --shadow           add the soft contact shadow under the base (off by default)
  --hl MODE          edge highlight on the body chamfer: current | soft | none
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(name, default=None, cast=str):
    return cast(argv[argv.index(name) + 1]) if name in argv else default

START_ANGLE = -20.0                            # first frame: screen turned 20° to the left
ANGLE   = arg("--angle", START_ANGLE, float)
OUT     = arg("--out")
FRAMES  = arg("--frames", 0, int)
SEQ_DIR = arg("--seq-dir", os.path.join(HERE, "renders", "seq"))
SCALE   = arg("--scale", 50, int)
SAMPLES = arg("--samples", 48, int)
SAVE    = arg("--save")
GPU     = "--gpu" in argv                      # Apple Silicon: render on the GPU (Metal)
FILTER  = arg("--filter", 1.5, float)          # pixel filter width (Blender default 1.5; lower = crisper)
BORDER  = arg("--border")                       # "x0,y0,x1,y1" (0–1, y from bottom): render only this region
GLARE   = arg("--glare", "on")                   # front glass reflection: on | off (matte glass, no top glare)
HL      = arg("--hl", "current")                 # edge highlight: current | soft | none
NO_SHADOW = "--shadow" not in argv            # no floor shadow by default (Apple-style); --shadow adds it
UI_IMG  = os.path.join(HERE, "perps-ui.png")   # 2592×1620 (16:10)

# ── Dimensions (metres) ──
SCREEN_W, SCREEN_H = 0.592, 0.370               # 16:10, matches the UI image
BEZEL = 0.011
BODY_W, BODY_H, BODY_D = SCREEN_W + 2 * BEZEL, SCREEN_H + 2 * BEZEL, 0.044   # depth doubled (was 0.022)
BODY_R = 0.010                                   # corner radius
GAP = 0.1121                                     # base top → body bottom (0.118 −5%: shorter stand)
ARM_W = 0.1655                                   # 0.150 +2% +3% +5%
BASE_W, BASE_D, BASE_T = ARM_W, 0.190, 0.008     # base as wide as the arm
BODY_Z = BASE_T + GAP + BODY_H / 2               # body centre height

# ── Reset ──
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def rounded_box(name, w, h, d, r, segments=8, bevel=0.0):
    """Box w (x) × d (y) × h (z) with rounded vertical-plane corners (radius r in the x–z plane)."""
    bm = bmesh.new()
    pts = []
    for cx, cz, a0 in [(w/2 - r, h/2 - r, 0), (-w/2 + r, h/2 - r, 90), (-w/2 + r, -h/2 + r, 180), (w/2 - r, -h/2 + r, 270)]:
        for i in range(segments + 1):
            a = math.radians(a0 + 90 * i / segments)
            pts.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    front = [bm.verts.new((x, -d/2, z)) for x, z in pts]
    back  = [bm.verts.new((x,  d/2, z)) for x, z in pts]
    bm.faces.new(list(reversed(front)))
    bm.faces.new(back)
    n = len(pts)
    for i in range(n):
        bm.faces.new([front[i], front[(i+1) % n], back[(i+1) % n], back[i]])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    if bevel:
        m = ob.modifiers.new("Bevel", "BEVEL"); m.width = bevel; m.segments = 4; m.limit_method = "ANGLE"
    for p in me.polygons: p.use_smooth = True
    ob.modifiers.new("WN", "WEIGHTED_NORMAL")
    return ob

def plane(name, w, h):
    bpy.ops.mesh.primitive_plane_add(size=1)
    ob = bpy.context.active_object; ob.name = name
    ob.scale = (w, h, 1)
    ob.rotation_euler = (math.radians(90), 0, 0)    # normal → −Y (towards the camera)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    return ob

# ── Materials ──
def mat_aluminium():
    m = bpy.data.materials.new("Aluminium"); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.20, 0.205, 0.215, 1)   # dark grey anodised aluminium
    b.inputs["Metallic"].default_value = 1.0
    b.inputs["Roughness"].default_value = {"current": 0.30, "soft": 0.42, "none": 0.55}[HL]
    return m

def mat_glass_black():
    m = bpy.data.materials.new("FrontGlass"); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.006, 0.006, 0.007, 1)
    b.inputs["Roughness"].default_value = 0.06 if GLARE == "on" else 0.45
    b.inputs["Specular IOR Level"].default_value = 0.5 if GLARE == "on" else 0.08
    return m

def mat_screen():
    m = bpy.data.materials.new("Screen"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = bpy.data.images.load(UI_IMG)
    tex.interpolation = "Cubic"
    emit = nt.nodes.new("ShaderNodeEmission"); emit.inputs["Strength"].default_value = 1.0
    gloss = nt.nodes.new("ShaderNodeBsdfGlossy"); gloss.inputs["Roughness"].default_value = 0.08
    mix = nt.nodes.new("ShaderNodeMixShader"); mix.inputs["Fac"].default_value = 0.04 if GLARE == "on" else 0.0   # faint glass reflection
    nt.links.new(tex.outputs["Color"], emit.inputs["Color"])
    nt.links.new(emit.outputs[0], mix.inputs[1]); nt.links.new(gloss.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    return m

AL, GLASS, SCREEN = mat_aluminium(), mat_glass_black(), mat_screen()
# Stand: same aluminium, a touch darker and rougher so the big key light doesn't blow it out to white
AL_STAND = AL.copy(); AL_STAND.name = "AluminiumStand"
_b = AL_STAND.node_tree.nodes["Principled BSDF"]
_b.inputs["Base Color"].default_value = (0.17, 0.175, 0.185, 1); _b.inputs["Roughness"].default_value = 0.38

# ── Monitor ──
rig = bpy.data.objects.new("MonitorRig", None); scene.collection.objects.link(rig)

body = rounded_box("Body", BODY_W, BODY_H, BODY_D, BODY_R, bevel=0.007 if HL == "soft" else 0.004)  # chamfer catches the light, like the reference
body.data.materials.append(AL)
body.location = (0, 0, BODY_Z)

glass = rounded_box("Glass", BODY_W - 0.003, BODY_H - 0.003, 0.0012, BODY_R - 0.0015)
glass.data.materials.append(GLASS)
glass.location = (0, -BODY_D/2 - 0.0004, BODY_Z)

screen = plane("Screen", SCREEN_W, SCREEN_H)
screen.data.materials.append(SCREEN)
screen.location = (0, -BODY_D/2 - 0.0012, BODY_Z)

# Arm: one slanted aluminium slab from the back of the body down to the back of the base
arm_top = Vector((0, BODY_D/2 + 0.004, BODY_Z + 0.02))
arm_bot = Vector((0, BASE_D/2 - 0.03, BASE_T))
arm_len = (arm_top - arm_bot).length
arm = rounded_box("Arm", ARM_W, arm_len, 0.014, 0.004, bevel=0.002)
arm.data.materials.append(AL_STAND)
mid = (arm_top + arm_bot) / 2
arm.location = mid
# rotating (0,0,1) about X by θ gives (0, −sinθ, cosθ); solve for the top−bottom direction
arm.rotation_euler = (math.atan2(-(arm_top.y - arm_bot.y), arm_top.z - arm_bot.z), 0, 0)

# Base: flat rounded plate (rounded in plan view)
base = rounded_box("Base", BASE_W, BASE_D, BASE_T, 0.03, bevel=0.002)
base.rotation_euler = (math.radians(90), 0, 0)
base.location = (0, 0.03, BASE_T/2)
base.data.materials.append(AL_STAND)

for ob in (body, glass, screen, arm, base):
    ob.parent = rig
rig.location = (0, 0, 0)

# ── Contact shadow: a soft black ellipse under the base (renders as semi-transparent on the
#    transparent film; a Cycles shadow catcher left a hard-edged grey patch with this lighting) ──
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0.03, 0.0004))
blob = bpy.context.active_object; blob.name = "ContactShadow"; blob.scale = (0.46, 0.34, 1)
sm = bpy.data.materials.new("ContactShadow"); sm.use_nodes = True; sm.blend_method = "BLEND"
snt = sm.node_tree; snt.nodes.clear()
so = snt.nodes.new("ShaderNodeOutputMaterial")
stc = snt.nodes.new("ShaderNodeTexCoord")
sg = snt.nodes.new("ShaderNodeTexGradient"); sg.gradient_type = "SPHERICAL"
smap = snt.nodes.new("ShaderNodeMapping"); smap.inputs["Location"].default_value = (0, 0, 0)
smap.inputs["Scale"].default_value = (2, 2, 2)
sramp = snt.nodes.new("ShaderNodeValToRGB")
sramp.color_ramp.elements[0].position = 0.0; sramp.color_ramp.elements[0].color = (0, 0, 0, 1)
sramp.color_ramp.elements[1].position = 0.75; sramp.color_ramp.elements[1].color = (0.42, 0.42, 0.42, 1)
stp = snt.nodes.new("ShaderNodeBsdfTransparent")
sbl = snt.nodes.new("ShaderNodeEmission"); sbl.inputs["Color"].default_value = (0, 0, 0, 1)
smix = snt.nodes.new("ShaderNodeMixShader")
snt.links.new(stc.outputs["Object"], smap.inputs["Vector"]); snt.links.new(smap.outputs[0], sg.inputs["Vector"])
snt.links.new(sg.outputs["Fac"], sramp.inputs["Fac"])
# fac 0 → transparent, fac 0.42 at the centre → 42% black
snt.links.new(sramp.outputs["Color"], smix.inputs["Fac"])
snt.links.new(stp.outputs[0], smix.inputs[1]); snt.links.new(sbl.outputs[0], smix.inputs[2])
snt.links.new(smix.outputs[0], so.inputs["Surface"])
blob.data.materials.append(sm)
blob.visible_shadow = False
blob.hide_render = NO_SHADOW

# ── Lights ──
def area(name, loc, size, power, target=(0, 0, BODY_Z)):
    d = bpy.data.lights.new(name, "AREA"); d.size = size; d.energy = power
    ob = bpy.data.objects.new(name, d); scene.collection.objects.link(ob); ob.location = loc
    direction = Vector(target) - Vector(loc)
    ob.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return ob

area("Key",  (-1.3, -1.4, 1.5), 1.6, 110)
fill = area("Fill", ( 1.6, -1.0, 0.9), 1.6, 45)
area("Top",  ( 0.0, -0.2, 2.0), 1.2, 70)
rim = area("Rim",  ( 0.0,  1.6, 1.2), 1.2, 60)
for l in (fill, rim):
    l.data.use_shadow = False
# Edge highlight: the fill + rim lights draw the thin bright line on the chamfer
if HL == "soft":
    rim.data.energy *= 0.5
if HL == "none":
    for l in (fill, rim):
        l.visible_glossy = False                   # only key + top cast the floor shadow

# World: studio gradient (dark floor → bright ceiling) so the metal reflects grey tones, not flat white
world = bpy.data.worlds.new("World"); scene.world = world; world.use_nodes = True
wn = world.node_tree.nodes; wl = world.node_tree.links
bg = wn["Background"]; bg.inputs["Strength"].default_value = 0.45
tc = wn.new("ShaderNodeTexCoord"); sep = wn.new("ShaderNodeSeparateXYZ")
ramp = wn.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.42; ramp.color_ramp.elements[0].color = (0.10, 0.10, 0.11, 1)
ramp.color_ramp.elements[1].position = 0.72; ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
mr = wn.new("ShaderNodeMapRange"); mr.inputs["From Min"].default_value = -1; mr.inputs["From Max"].default_value = 1
wl.new(tc.outputs["Generated"], sep.inputs[0]); wl.new(sep.outputs["Z"], mr.inputs["Value"])
wl.new(mr.outputs["Result"], ramp.inputs["Fac"]); wl.new(ramp.outputs["Color"], bg.inputs["Color"])

# ── Camera ──
cam_d = bpy.data.cameras.new("Cam"); cam_d.lens = 85; cam_d.sensor_width = 36
cam = bpy.data.objects.new("Cam", cam_d); scene.collection.objects.link(cam); scene.camera = cam
FRAME_W = 0.88                                    # metres visible across the frame at the monitor
dist = FRAME_W * cam_d.lens / cam_d.sensor_width
cam_z = (BODY_Z + BODY_H / 2) / 2           # centre of the whole monitor, floor to top
cam.location = (0, -dist, cam_z)
cam.rotation_euler = (math.radians(90), 0, 0)

# ── Render settings ──
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
if GPU:
    cp = bpy.context.preferences.addons["cycles"].preferences
    cp.compute_device_type = "METAL"
    cp.get_devices()
    for d in cp.devices: d.use = True
    scene.cycles.device = "GPU"
    print("GPU devices:", [d.name for d in cp.devices if d.use])
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.filter_width = FILTER
if BORDER:
    b = [float(v) for v in BORDER.split(",")]
    scene.render.use_border = True; scene.render.use_crop_to_border = True
    scene.render.border_min_x, scene.render.border_min_y, scene.render.border_max_x, scene.render.border_max_y = b
scene.render.film_transparent = True
scene.render.resolution_x, scene.render.resolution_y = 1187, 870
scene.render.resolution_percentage = SCALE
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "Standard"   # keeps the UI colours as designed
scene.view_settings.exposure = 0.0

def render_at(angle, path):
    rig.rotation_euler = (0, 0, math.radians(angle))
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print("RENDERED", angle, path)

if SAVE:
    rig.rotation_euler = (0, 0, math.radians(ANGLE))
    bpy.ops.wm.save_as_mainfile(filepath=SAVE)
if OUT:
    render_at(ANGLE, OUT)
if FRAMES:
    os.makedirs(SEQ_DIR, exist_ok=True)
    for i in range(FRAMES):
        t = i / (FRAMES - 1)
        render_at(START_ANGLE * (1 - t), os.path.join(SEQ_DIR, f"frame_{i:03d}.png"))
