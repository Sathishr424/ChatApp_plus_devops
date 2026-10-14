#!/bin/bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGES_DIR="$SCRIPT_DIR/packages"

USERNAME="${1:-}"
REGISTRY="oci://registry-1.docker.io/$USERNAME"

cleanup_on_error() {
    echo
    echo "❌ Push failed!"
    echo "Failed command: $BASH_COMMAND"
    echo "Line: $LINENO"
}

trap cleanup_on_error ERR

if [[ -z "$USERNAME" ]]; then
    echo "❌ Registry username is required"
    echo "Usage: $0 <username>"
    exit 1
fi

if [[ ! -d "$PACKAGES_DIR" ]]; then
    echo "❌ Package directory does not exist: $PACKAGES_DIR"
    exit 1
fi

echo "🚀 Pushing Helm charts to $REGISTRY..."
echo

for package in "$PACKAGES_DIR"/*.tgz; do
    echo "📦 Pushing $(basename "$package")..."

    helm push "$package" "$REGISTRY"

    echo "✅ $(basename "$package") pushed successfully"
    echo
done

echo "🎉 All Helm charts pushed successfully!"
