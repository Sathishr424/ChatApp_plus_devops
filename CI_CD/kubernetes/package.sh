#!/bin/bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/packages"

CHARTS=(
    "chatapp-redis"
    "chatapp-postgres"
    "chatapp-nginx"
    "chatapp-client"
    "chatapp-backend"
    "chatapp-socket"
    "chatapp-storage"
)

cleanup_on_error() {
    echo
    echo "❌ Packaging failed!"
    echo "Failed command: $BASH_COMMAND"
    echo "Line: $LINENO"
}

trap cleanup_on_error ERR

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

package_chart() {
    local name="$1"
    local chart="$SCRIPT_DIR/$name"

    echo
    echo "📦 Packaging $name..."

    helm lint "$chart"

    helm package "$chart" \
        --destination "$OUTPUT_DIR"

    echo "✅ $name packaged successfully"
}

for chart in "${CHARTS[@]}"; do
    package_chart "$chart"
done

echo
echo "🎉 All Helm charts packaged successfully!"
echo
echo "📦 Packages:"
ls -lh "$OUTPUT_DIR"
