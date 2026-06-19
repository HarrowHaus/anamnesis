# Crop & QA review (Phase E5)

Plates flagged by the subject-aware crop pass (`scripts/crop_plates.py`).
Each was still cropped (saliency fallback) but needs a human eye before
Phase F. To fix one: set its `crop_box` (l,t,r,b) in
`data/plate-manifest.json`, set `crop` to `pending`, and re-run.
Full-size masters are in `src/assets/plates/_originals/`.

**Processed this run:** 8  ·  **back-filled:** 0  ·  **currently flagged:** 1

| Collection | Slug | Issue |
|---|---|---|
| figures | constantin-volney | no face detected (it is an engraving) — saliency crop, acceptable |
