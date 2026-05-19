
/* Jooking V2.5.27 - map position fixes */

function clampPosition(left, top) {
  const SAFE_RIGHT = 84;
  const SAFE_BOTTOM = 88;

  return {
    left: Math.min(left, SAFE_RIGHT),
    top: Math.min(top, SAFE_BOTTOM)
  };
}

/* Replace these coordinates in COUNTRY_COORDS */
const FIXED_COORDS = {
  "Australia": [78, 56],
  "Canada": [21, 20],
  "United States": [19, 33]
};

/*
Replace:

pin.style.left = `${coords[0]}%`;
pin.style.top = `${coords[1]}%`;

With:

const pos = clampPosition(coords[0], coords[1]);

pin.style.left = `${pos.left}%`;
pin.style.top = `${pos.top}%`;
*/
