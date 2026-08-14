#!/usr/bin/env python3
"""Native-resolution perceptual gates for RazorSense media derivatives."""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter, sobel


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reference-dir", required=True, type=Path)
    parser.add_argument("--candidate-dir", required=True, type=Path)
    parser.add_argument("--min-ssim", required=True, type=float)
    parser.add_argument("--min-psnr", required=True, type=float)
    parser.add_argument("--max-delta-e-p95", required=True, type=float)
    parser.add_argument("--max-edge-shift", required=True, type=float)
    return parser.parse_args()


def load_rgb(path: Path) -> np.ndarray:
    with Image.open(path) as image:
        return np.asarray(image.convert("RGB"), dtype=np.float64) / 255.0


def srgb_to_linear(rgb: np.ndarray) -> np.ndarray:
    return np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)


def linear_rgb_to_lab(rgb: np.ndarray) -> np.ndarray:
    matrix = np.array(
        [
            [0.4124564, 0.3575761, 0.1804375],
            [0.2126729, 0.7151522, 0.0721750],
            [0.0193339, 0.1191920, 0.9503041],
        ]
    )
    xyz = rgb @ matrix.T
    xyz /= np.array([0.95047, 1.0, 1.08883])
    delta = 6.0 / 29.0
    f = np.where(xyz > delta**3, np.cbrt(xyz), xyz / (3 * delta**2) + 4.0 / 29.0)
    return np.stack(
        [116.0 * f[..., 1] - 16.0, 500.0 * (f[..., 0] - f[..., 1]), 200.0 * (f[..., 1] - f[..., 2])],
        axis=-1,
    )


def windowed_ssim(reference: np.ndarray, candidate: np.ndarray) -> float:
    sigma = 1.5
    mu_reference = gaussian_filter(reference, sigma=(sigma, sigma, 0), mode="reflect")
    mu_candidate = gaussian_filter(candidate, sigma=(sigma, sigma, 0), mode="reflect")
    variance_reference = gaussian_filter(reference * reference, sigma=(sigma, sigma, 0), mode="reflect") - mu_reference**2
    variance_candidate = gaussian_filter(candidate * candidate, sigma=(sigma, sigma, 0), mode="reflect") - mu_candidate**2
    covariance = gaussian_filter(reference * candidate, sigma=(sigma, sigma, 0), mode="reflect") - mu_reference * mu_candidate
    c1 = 0.01**2
    c2 = 0.03**2
    score = ((2 * mu_reference * mu_candidate + c1) * (2 * covariance + c2)) / (
        (mu_reference**2 + mu_candidate**2 + c1) * (variance_reference + variance_candidate + c2)
    )
    return float(np.mean(score))


def linear_psnr(reference: np.ndarray, candidate: np.ndarray) -> float:
    mse = float(np.mean((reference - candidate) ** 2))
    return math.inf if mse == 0.0 else 10.0 * math.log10(1.0 / mse)


def delta_e_2000(lab1: np.ndarray, lab2: np.ndarray) -> np.ndarray:
    l1, a1, b1 = np.moveaxis(lab1, -1, 0)
    l2, a2, b2 = np.moveaxis(lab2, -1, 0)
    c1 = np.hypot(a1, b1)
    c2 = np.hypot(a2, b2)
    c_bar = (c1 + c2) / 2.0
    g = 0.5 * (1.0 - np.sqrt(c_bar**7 / (c_bar**7 + 25.0**7)))
    a1_prime = (1.0 + g) * a1
    a2_prime = (1.0 + g) * a2
    c1_prime = np.hypot(a1_prime, b1)
    c2_prime = np.hypot(a2_prime, b2)
    h1_prime = np.mod(np.degrees(np.arctan2(b1, a1_prime)), 360.0)
    h2_prime = np.mod(np.degrees(np.arctan2(b2, a2_prime)), 360.0)

    delta_l = l2 - l1
    delta_c = c2_prime - c1_prime
    delta_h_angle = h2_prime - h1_prime
    delta_h_angle = np.where(delta_h_angle > 180.0, delta_h_angle - 360.0, delta_h_angle)
    delta_h_angle = np.where(delta_h_angle < -180.0, delta_h_angle + 360.0, delta_h_angle)
    delta_h_angle = np.where(c1_prime * c2_prime == 0.0, 0.0, delta_h_angle)
    delta_h = 2.0 * np.sqrt(c1_prime * c2_prime) * np.sin(np.radians(delta_h_angle) / 2.0)

    l_bar = (l1 + l2) / 2.0
    c_bar_prime = (c1_prime + c2_prime) / 2.0
    h_difference = np.abs(h1_prime - h2_prime)
    h_sum = h1_prime + h2_prime
    h_bar = np.where(
        c1_prime * c2_prime == 0.0,
        h_sum,
        np.where(h_difference <= 180.0, h_sum / 2.0, np.where(h_sum < 360.0, (h_sum + 360.0) / 2.0, (h_sum - 360.0) / 2.0)),
    )

    t = (
        1.0
        - 0.17 * np.cos(np.radians(h_bar - 30.0))
        + 0.24 * np.cos(np.radians(2.0 * h_bar))
        + 0.32 * np.cos(np.radians(3.0 * h_bar + 6.0))
        - 0.20 * np.cos(np.radians(4.0 * h_bar - 63.0))
    )
    delta_theta = 30.0 * np.exp(-((h_bar - 275.0) / 25.0) ** 2)
    r_c = 2.0 * np.sqrt(c_bar_prime**7 / (c_bar_prime**7 + 25.0**7))
    s_l = 1.0 + (0.015 * (l_bar - 50.0) ** 2) / np.sqrt(20.0 + (l_bar - 50.0) ** 2)
    s_c = 1.0 + 0.045 * c_bar_prime
    s_h = 1.0 + 0.015 * c_bar_prime * t
    r_t = -np.sin(np.radians(2.0 * delta_theta)) * r_c

    l_term = delta_l / s_l
    c_term = delta_c / s_c
    h_term = delta_h / s_h
    return np.sqrt(np.maximum(0.0, l_term**2 + c_term**2 + h_term**2 + r_t * c_term * h_term))


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def sobel_edge_mask(rgb: np.ndarray) -> np.ndarray:
    luma = luminance(rgb)
    magnitude = np.hypot(sobel(luma, axis=0, mode="reflect"), sobel(luma, axis=1, mode="reflect"))
    nonzero = magnitude[magnitude > 1e-9]
    if nonzero.size == 0:
        return np.zeros_like(magnitude, dtype=bool)
    threshold = max(float(np.percentile(nonzero, 90.0)), 1e-6)
    return magnitude >= threshold


def symmetric_edge_distance(reference: np.ndarray, candidate: np.ndarray) -> float:
    reference_edges = sobel_edge_mask(reference)
    candidate_edges = sobel_edge_mask(candidate)
    if not reference_edges.any() and not candidate_edges.any():
        return 0.0
    if not reference_edges.any() or not candidate_edges.any():
        return math.inf
    to_candidate = distance_transform_edt(~candidate_edges)[reference_edges]
    to_reference = distance_transform_edt(~reference_edges)[candidate_edges]
    return float(max(np.percentile(to_candidate, 95.0), np.percentile(to_reference, 95.0)))


def candidate_matches(reference: Path, candidate_files: list[Path]) -> list[Path]:
    exact = [path for path in candidate_files if path.name == reference.name]
    variants = [path for path in candidate_files if path.stem.startswith(f"{reference.stem}-")]
    return sorted(exact + variants)


def main() -> int:
    args = parse_args()
    references = sorted(args.reference_dir.glob("*.png"))
    candidates = sorted(args.candidate_dir.glob("*.png"))
    if not references:
        print(json.dumps({"error": f"No reference PNGs in {args.reference_dir}"}), file=sys.stderr)
        return 1

    used_candidates: set[Path] = set()
    failed = False
    comparisons = 0
    for reference_path in references:
        matches = candidate_matches(reference_path, candidates)
        if not matches:
            print(json.dumps({"reference": reference_path.name, "error": "missing candidate"}))
            failed = True
            continue

        reference_srgb = load_rgb(reference_path)
        reference_linear = srgb_to_linear(reference_srgb)
        reference_lab = linear_rgb_to_lab(reference_linear)
        for candidate_path in matches:
            used_candidates.add(candidate_path)
            comparisons += 1
            candidate_srgb = load_rgb(candidate_path)
            if candidate_srgb.shape != reference_srgb.shape:
                result = {
                    "reference": reference_path.name,
                    "candidate": candidate_path.name,
                    "error": "native resolution mismatch",
                    "referenceShape": list(reference_srgb.shape),
                    "candidateShape": list(candidate_srgb.shape),
                    "passed": False,
                }
                print(json.dumps(result, sort_keys=True))
                failed = True
                continue

            candidate_linear = srgb_to_linear(candidate_srgb)
            ssim = windowed_ssim(reference_linear, candidate_linear)
            psnr = linear_psnr(reference_linear, candidate_linear)
            psnr_report: float | str = psnr if math.isfinite(psnr) else "Infinity"
            delta_e_p95 = float(np.percentile(delta_e_2000(reference_lab, linear_rgb_to_lab(candidate_linear)), 95.0))
            edge_shift = symmetric_edge_distance(reference_linear, candidate_linear)
            pixel_identical = bool(np.array_equal(reference_srgb, candidate_srgb))
            png_bytes_identical = reference_path.read_bytes() == candidate_path.read_bytes()
            passed = (
                ssim >= args.min_ssim
                and psnr >= args.min_psnr
                and delta_e_p95 <= args.max_delta_e_p95
                and edge_shift <= args.max_edge_shift
            )
            print(
                json.dumps(
                    {
                        "candidate": candidate_path.name,
                        "deltaE2000P95": delta_e_p95,
                        "edgeShiftP95Px": edge_shift,
                        "linearPSNRdB": psnr_report,
                        "passed": passed,
                        "pixelIdentical": pixel_identical,
                        "pngBytesIdentical": png_bytes_identical,
                        "reference": reference_path.name,
                        "ssim": ssim,
                    },
                    allow_nan=False,
                    sort_keys=True,
                )
            )
            failed = failed or not passed

    extra_candidates = sorted(path.name for path in candidates if path not in used_candidates)
    if extra_candidates:
        print(json.dumps({"error": "extra candidates", "files": extra_candidates}))
        failed = True

    print(json.dumps({"comparisons": comparisons, "passed": not failed}, sort_keys=True))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
