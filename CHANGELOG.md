# Changelog

## 0.2.7 — 2026-11-14

- Fix FIT activity distance encoding: values in metres are now stored at the FIT scale of 100, instead of 1000. This also corrects lap and session total distances.
- Fix FIT activity speed encoding: values in metres per second are now stored at the FIT scale of 1000, instead of 100.
- Add regression tests for GPX and TCX conversions, including indoor TCX, zero and fractional values, field limits, and the separate FIT course encoder. Generated files are checked with the Garmin FIT SDK.
