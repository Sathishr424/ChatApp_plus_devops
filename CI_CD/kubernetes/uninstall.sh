#!/bin/bash

set -Eeuo pipefail

NAMESPACE="chatapp"

cleanup_on_error() {
    echo
    echo "❌ Uninstall failed!"
    echo "Failed command: $BASH_COMMAND"
    echo "Line: $LINENO"
}

trap cleanup_on_error ERR

uninstall_chart() {
    local name="$1"

    echo
    echo "🗑️ Uninstalling $name..."

    helm uninstall "$name" \
        --namespace "$NAMESPACE"

    echo "✅ $name uninstalled successfully"
}

uninstall_chart "chatapp-redis"
uninstall_chart "chatapp-postgres"
uninstall_chart "chatapp-nginx"

uninstall_chart "chatapp-client"
uninstall_chart "chatapp-backend"
uninstall_chart "chatapp-socket"
uninstall_chart "chatapp-storage"

echo

kubectl delete all,pvc,pv,ingress,secrets,configMaps --all -n chatapp
