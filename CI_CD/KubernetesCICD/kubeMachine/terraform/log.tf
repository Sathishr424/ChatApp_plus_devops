output "log_instances_private_ips" {
  description = "Getting the instances private IPs"

  value = <<-EOF
sudo tee -a /etc/hosts > /dev/null <<EOT
${aws_instance.master-instance.private_ip} master
${aws_instance.worker1-instance.private_ip} worker1
${aws_instance.worker2-instance.private_ip} worker2
EOT
EOF
}
