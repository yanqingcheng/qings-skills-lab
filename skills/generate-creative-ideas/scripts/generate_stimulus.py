#!/usr/bin/env python3
"""Generate a private, long alphanumeric stimulus for creative ideation."""

from __future__ import annotations

import argparse
import string
import sys
from secrets import choice


ALPHABET = string.ascii_letters + string.digits
DEFAULT_LENGTH = 512
MIN_LENGTH = 128


def generate(length: int) -> str:
    """Return ``length`` cryptographically random ASCII letters and digits."""

    if length < MIN_LENGTH:
        raise ValueError(f"length must be at least {MIN_LENGTH}")
    return "".join(choice(ALPHABET) for _ in range(length))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a long random alphanumeric ideation stimulus."
    )
    parser.add_argument(
        "--length",
        type=int,
        default=DEFAULT_LENGTH,
        help=f"number of characters (minimum {MIN_LENGTH}; default: {DEFAULT_LENGTH})",
    )
    args = parser.parse_args()

    try:
        stimulus = generate(args.length)
    except ValueError as error:
        parser.error(str(error))

    sys.stdout.write(stimulus)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
