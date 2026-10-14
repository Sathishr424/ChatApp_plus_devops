#!/bin/bash

set -e

PRIVATE_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}')

echo "Private IP: $PRIVATE_IP"

echo "Initializing Kubernetes control plane..."

sudo kubeadm init \
  --apiserver-advertise-address="$PRIVATE_IP" \
  --pod-network-cidr=192.168.0.0/16

echo "Configuring kubectl..."

mkdir -p "$HOME/.kube"

sudo cp /etc/kubernetes/admin.conf "$HOME/.kube/config"

sudo chown "$(id -u):$(id -g)" "$HOME/.kube/config"

echo "Waiting for Kubernetes API server..."

until kubectl get nodes >/dev/null 2>&1; do
    echo "API server not ready..."
    sleep 5
done

echo "Installing Helm..."

curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash

echo "Installing Calico..."

kubectl apply \
  -f https://raw.githubusercontent.com/projectcalico/calico/v3.32.2/manifests/calico.yaml

echo "Installing ingress-nginx..."

kubectl apply \
  -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

echo "Master provisioning complete."

kubectl get nodes
kubectl get pods -A

sudo kubeadm token create --ttl 168h --print-join-command > /home/ubuntu/kube_join.sh
chmod +x /home/ubuntu/kube_join.sh

mkdir -p /home/ubuntu/.kube
sudo cp /etc/kubernetes/admin.conf /home/ubuntu/.kube/config
sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube
