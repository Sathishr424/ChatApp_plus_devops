#!/bin/bash

PUBLIC_IP="$1"

echo "Instance public IP: $PUBLIC_IP"

sed -i 's/MACHINE_01_IP[[:space:]]*=[[:space:]]*"[^"]*"/MACHINE_01_IP = "'"$PUBLIC_IP"'"/' ../Jenkinsfile

cd ../

gitpush "changes"
