#!/bin/bash

set -Eeuo pipefail

NAMESPACE="chatapp"

cleanup_on_error() {
    echo
    echo "❌ Deployment failed!"
    echo "Failed command: $BASH_COMMAND"
    echo "Line: $LINENO"
}

trap cleanup_on_error ERR

install_chart() {
    local name="$1"
    local chart="$2"

    echo
    echo "🚀 Installing $name..."

    helm upgrade --install "$name" "$chart" \
        --namespace "$NAMESPACE" \
        --create-namespace

    echo "✅ $name installed successfully"
}

install_chart "chatapp-redis" "./chatapp-redis/"
install_chart "chatapp-postgres" "./chatapp-postgres/"
install_chart "chatapp-nginx" "./chatapp-nginx/"

install_chart "chatapp-client" "./chatapp-client/"
install_chart "chatapp-backend" "./chatapp-backend/"
install_chart "chatapp-socket" "./chatapp-socket/"
install_chart "chatapp-storage" "./chatapp-storage/"

echo
echo "🎉 All Helm charts installed successfully!"
