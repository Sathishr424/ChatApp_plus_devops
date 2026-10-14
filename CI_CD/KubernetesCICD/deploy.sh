#!/bin/bash

set -Eeuo pipefail

USERNAME="$1"
REGISTRY="oci://registry-1.docker.io/$USERNAME"
NAMESPACE="chatapp"

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
    echo "❌ Deployment failed!"
    echo "Failed command: $BASH_COMMAND"
    echo "Line: $LINENO"
}

trap cleanup_on_error ERR


if [[ -z "$USERNAME" ]]; then
    echo "❌ Docker Hub username is required"
    echo "Usage: $0 <username>"
    exit 1
fi


install_chart() {
    local name="$1"

    echo
    echo "🚀 Installing/upgrading $name..."
    echo "📦 Chart: $REGISTRY/$name"

    helm upgrade --install "$name" \
        "$REGISTRY/$name" \
        --namespace "$NAMESPACE" \
        --create-namespace \
        --timeout 5m

    echo "✅ $name deployed successfully"
}


for chart in "${CHARTS[@]}"; do
    install_chart "$chart"
done


echo
echo "🎉 All Helm charts deployed successfully!"
