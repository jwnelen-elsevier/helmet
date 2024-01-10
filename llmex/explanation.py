from dataclasses import dataclass

import numpy as np


@dataclass
class Explanation:
    """Generic class to represent an Explanation"""

    text: str
    tokens: str
    scores: np.array
    explainer: str
    target: int