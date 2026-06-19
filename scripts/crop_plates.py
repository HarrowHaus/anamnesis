#!/usr/bin/env python
"""crop_plates.py — Phase E5: subject-aware crop + QA pass (docs/IMAGE_SOURCING.md §7).

Locks plate framing before Phase F (duotone) and G (motion) so it runs once on
the final plates. Non-destructive: full-size originals are kept in
src/assets/plates/_originals/; cropped, optimized WebP derivatives are written to
the live plate paths (frontmatter `plate:` extensions + the manifest are updated
to match). Idempotent: a `crop` status is recorded per record in the manifest and
processed plates are skipped, so this re-runs cleanly as backlog entries get
sourced later.

Crop logic by plate type:
  - SVG (the 7 geometric symbols): passed through untouched (already framed).
  - Portraits (figures): MediaPipe face detection; crop to the target ratio with
    the face horizontally centred and in the upper third, never clipped.
  - Everything else (engravings, artifacts, timeline, casebook, pillars):
    smartcrop saliency crop around the important region.

Target ratios are the ones the components actually render (confirmed from CSS):
  symbols 3:2 · figures 3:4 · timeline 16:9 · casebook 16:10 · pillars 16:7.

Run:  .venv-crop/Scripts/python.exe scripts/crop_plates.py [--force]
"""
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image
import smartcrop

ROOT = Path(__file__).resolve().parent.parent
PLATES = ROOT / "src" / "assets" / "plates"
ORIGINALS = PLATES / "_originals"
CONTENT = ROOT / "src" / "content"
MANIFEST = ROOT / "data" / "plate-manifest.json"

RATIOS = {"symbols": (3, 2), "figures": (3, 4), "timeline": (16, 9),
          "casebook": (16, 10), "pillars": (16, 7)}
PORTRAIT = {"figures"}
LONG_EDGE = 1280
WEBP_Q = 82
FORCE = "--force" in sys.argv

flags = []  # QA review entries: (collection, slug, reason)


def load_manifest():
    try:
        return json.loads(MANIFEST.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {}


def save_manifest(m):
    ordered = {k: m[k] for k in sorted(m)}
    MANIFEST.write_text(json.dumps(ordered, indent=2) + "\n", encoding="utf-8")


_NET = None
_MODELS = {
    "deploy.prototxt": "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt",
    "res10.caffemodel": "https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel",
}


def _net():
    """res10 SSD face detector. Model files auto-download to scripts/models/
    (git-ignored) on first run so the script is self-contained but the repo
    stays lean."""
    global _NET
    if _NET is None:
        import cv2
        import urllib.request
        mdir = ROOT / "scripts" / "models"
        mdir.mkdir(parents=True, exist_ok=True)
        for name, url in _MODELS.items():
            dest = mdir / name
            if not dest.exists():
                print(f"  downloading {name} ...")
                urllib.request.urlretrieve(url, dest)
        _NET = cv2.dnn.readNetFromCaffe(str(mdir / "deploy.prototxt"),
                                        str(mdir / "res10.caffemodel"))
    return _NET


def detect_face(path):
    """Largest face bbox (x, y, w, h) in pixels via OpenCV res10 DNN, with a
    Haar-cascade fallback for faces the DNN misses; None if neither finds one.
    (This mediapipe build ships only the Tasks API — no legacy solutions — so
    we use the protocol's named OpenCV-DNN fallback.)"""
    import cv2
    img = cv2.imread(str(path))
    if img is None:
        return None
    h, w = img.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0, (300, 300),
                                 (104.0, 177.0, 123.0))
    net = _net()
    net.setInput(blob)
    d = net.forward()
    best, best_conf = None, 0.5
    for i in range(d.shape[2]):
        conf = float(d[0, 0, i, 2])
        if conf > best_conf:
            x1, y1, x2, y2 = (d[0, 0, i, 3:7] * [w, h, w, h])
            best, best_conf = (x1, y1, x2 - x1, y2 - y1), conf
    if best:
        return tuple(float(v) for v in best)
    # Haar fallback (bundled with opencv; catches some engraved/older faces).
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    found = cascade.detectMultiScale(gray, 1.1, 5,
                                     minSize=(int(w * 0.08), int(h * 0.08)))
    if len(found):
        fx, fy, fw, fh = max(found, key=lambda b: b[2] * b[3])
        return (float(fx), float(fy), float(fw), float(fh))
    return None


def portrait_crop_box(W, H, face, ratio):
    """Crop box (l, t, r, b) of `ratio`, face centred horizontally and in the
    upper third with headroom. Returns (box, face_clipped: bool)."""
    tw, th = ratio
    aspect = tw / th
    fx, fy, fw, fh = face
    fcx, fcy = fx + fw / 2, fy + fh / 2
    # Largest crop of the target aspect that fits the image.
    ch = H
    cw = ch * aspect
    if cw > W:
        cw = W
        ch = cw / aspect
    # Face centre horizontal; face centre at 38% down (upper third + headroom).
    left = fcx - cw / 2
    top = fcy - 0.38 * ch
    left = max(0, min(left, W - cw))
    top = max(0, min(top, H - ch))
    box = (left, top, left + cw, top + ch)
    # Headroom / clipping check: the whole face must sit inside with a margin.
    margin = 0.04 * ch
    clipped = (fx < box[0] + margin or fy < box[1] + margin or
               fx + fw > box[2] - margin or fy + fh > box[3] - margin)
    return tuple(round(v) for v in box), clipped


def saliency_box(im, ratio):
    """smartcrop saliency crop box (l, t, r, b) of the target ratio."""
    tw, th = ratio
    sc = smartcrop.SmartCrop()
    # smartcrop scales internally; pass the ratio at a working size.
    result = sc.crop(im, tw * 100, th * 100)
    c = result["top_crop"]
    return (c["x"], c["y"], c["x"] + c["width"], c["y"] + c["height"])


def resize_long_edge(im, long_edge):
    w, h = im.size
    scale = min(1.0, long_edge / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    return im


def update_frontmatter_ext(collection, slug, new_ext):
    mdx = CONTENT / collection / f"{slug}.mdx"
    if not mdx.exists():
        return
    text = mdx.read_text(encoding="utf-8")
    new = re.sub(rf"^(plate:\s*\S*/{re.escape(slug)}\.)\w+\s*$",
                 rf"\g<1>{new_ext}", text, count=1, flags=re.MULTILINE)
    if new != text:
        mdx.write_text(new, encoding="utf-8")


def process(path, collection, slug, rec):
    ext = path.suffix.lower().lstrip(".")
    # SVG → passthrough.
    if ext == "svg":
        rec["crop"] = "passthrough"
        return
    ratio = RATIOS.get(collection, (3, 2))

    # Preserve the full-size master.
    orig_dir = ORIGINALS / collection
    orig_dir.mkdir(parents=True, exist_ok=True)
    master = orig_dir / path.name
    if not master.exists():
        shutil.copy2(path, master)

    try:
        im = Image.open(master).convert("RGB")
    except Exception as e:  # noqa: BLE001
        flags.append((collection, slug, f"failed to open ({e})"))
        rec["crop"] = "flagged"
        return
    W, H = im.size

    if collection in PORTRAIT:
        face = detect_face(master)
        if face is None:
            flags.append((collection, slug, "no face detected — used saliency crop"))
            box = saliency_box(im, ratio)
            rec["crop"] = "flagged"
        else:
            box, clipped = portrait_crop_box(W, H, face, ratio)
            if clipped:
                flags.append((collection, slug, "face near crop edge — headroom tight"))
                rec["crop"] = "flagged"
            else:
                rec["crop"] = "done"
    else:
        try:
            box = saliency_box(im, ratio)
            rec["crop"] = "done"
        except Exception as e:  # noqa: BLE001
            flags.append((collection, slug, f"saliency failed ({e})"))
            box = (0, 0, W, H)
            rec["crop"] = "flagged"

    cropped = resize_long_edge(im.crop(box), LONG_EDGE)
    out = path.with_suffix(".webp")
    cropped.save(out, "WEBP", quality=WEBP_Q, method=6)
    # Replace the non-webp live file + repoint frontmatter/manifest.
    if out != path:
        path.unlink(missing_ok=True)
        update_frontmatter_ext(collection, slug, "webp")
        rec["local_path"] = str(Path("src/assets/plates") / collection / out.name).replace("\\", "/")


def main():
    m = load_manifest()
    by_slug = {(r["collection"], r["slug"]): k for k, r in m.items()
               if "collection" in r and "slug" in r}
    processed = 0
    backfilled = 0
    for path in sorted(PLATES.rglob("*")):
        if ORIGINALS in path.parents or not path.is_file():
            continue
        if path.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".svg"):
            continue
        collection = path.parent.name
        slug = path.stem
        if collection not in RATIOS:
            continue
        key = by_slug.get((collection, slug)) or f"{collection}/{slug}"
        rec = m.get(key)
        if rec is None:  # back-fill pre-manifest plate
            rec = {"collection": collection, "slug": slug, "status": "downloaded",
                   "host": "(pre-manifest)",
                   "local_path": str(Path("src/assets/plates") / collection / path.name).replace("\\", "/")}
            m[key] = rec
            backfilled += 1
        if not FORCE and rec.get("crop") in ("done", "passthrough", "flagged"):
            continue
        process(path, collection, slug, rec)
        processed += 1
        print(f"  {rec.get('crop','?'):11} {collection}/{slug}")
    save_manifest(m)

    # QA report.
    lines = ["# Crop & QA review (Phase E5)", "",
             "Plates flagged by the subject-aware crop pass (`scripts/crop_plates.py`).",
             "Each was still cropped (saliency fallback) but needs a human eye before",
             "Phase F. Re-run after fixing; full-size masters are in",
             "`src/assets/plates/_originals/`.", "",
             f"**Processed this run:** {processed}  ·  **back-filled into manifest:** {backfilled}  ·  **flagged:** {len(flags)}",
             "", "| Collection | Slug | Issue |", "|---|---|---|"]
    for c, s, r in sorted(flags):
        lines.append(f"| {c} | {s} | {r} |")
    if not flags:
        lines.append("| — | — | none flagged |")
    (ROOT / "docs" / "CROP_REVIEW.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nprocessed {processed}, back-filled {backfilled}, flagged {len(flags)} "
          f"(see docs/CROP_REVIEW.md)")


if __name__ == "__main__":
    main()
