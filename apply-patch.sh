#!/usr/bin/env bash
set -e
cp assets/js/components.js ./assets/js/components.js
cp assets/js/admin-data.js ./assets/js/admin-data.js
cp pages/admin-data.html ./pages/admin-data.html
echo "Patch applied: menu cleaned, admin default restored to incidents."
