resource "null_resource" "get_join_command" {
  depends_on = [
    aws_instance.master-instance,
    aws_instance.worker1-instance,
    aws_instance.worker2-instance
  ]

  provisioner "local-exec" {
    command = <<-EOT
      scp -o StrictHostKeyChecking=no \
        -i ${path.module}/chatapp \
        ${var.login_user}@${aws_instance.master-instance.public_ip}:/home/ubuntu/kube_join.sh \
        /tmp/kube_join.sh
    EOT
  }

  provisioner "file" {
    source      = "/tmp/kube_join.sh"
    destination = "/tmp/kube_join.sh"

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("chatapp")
      host        = aws_instance.worker1-instance.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /tmp/kube_join.sh",
      "sudo /tmp/kube_join.sh"
    ]

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("chatapp")
      host        = aws_instance.worker1-instance.public_ip
    }
  }

  provisioner "file" {
    source      = "/tmp/kube_join.sh"
    destination = "/tmp/kube_join.sh"

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("chatapp")
      host        = aws_instance.worker2-instance.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /tmp/kube_join.sh",
      "sudo /tmp/kube_join.sh"
    ]

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("chatapp")
      host        = aws_instance.worker2-instance.public_ip
    }
  }
}
