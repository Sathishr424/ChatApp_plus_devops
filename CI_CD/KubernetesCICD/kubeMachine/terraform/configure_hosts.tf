resource "null_resource" "configure_master_hosts" {

  depends_on = [
    aws_instance.master-instance,
    aws_instance.worker1-instance,
    aws_instance.worker2-instance
  ]

  provisioner "remote-exec" {
    inline = [
      "echo '${aws_instance.master-instance.private_ip} master' | sudo tee -a /etc/hosts",
      "echo '${aws_instance.worker1-instance.private_ip} worker1' | sudo tee -a /etc/hosts",
      "echo '${aws_instance.worker2-instance.private_ip} worker2' | sudo tee -a /etc/hosts"
    ]

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("${path.module}/chatapp")
      host        = aws_instance.master-instance.public_ip
    }
  }
}

resource "null_resource" "configure_worker1_hosts" {

  depends_on = [
    aws_instance.master-instance,
    aws_instance.worker1-instance,
    aws_instance.worker2-instance
  ]

  provisioner "remote-exec" {
    inline = [
      "echo '${aws_instance.master-instance.private_ip} master' | sudo tee -a /etc/hosts",
      "echo '${aws_instance.worker1-instance.private_ip} worker1' | sudo tee -a /etc/hosts",
      "echo '${aws_instance.worker2-instance.private_ip} worker2' | sudo tee -a /etc/hosts"
    ]

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("${path.module}/chatapp")
      host        = aws_instance.worker1-instance.public_ip
    }
  }
}


resource "null_resource" "configure_worker2_hosts" {

  depends_on = [
    aws_instance.master-instance,
    aws_instance.worker1-instance,
    aws_instance.worker2-instance
  ]

  provisioner "remote-exec" {
    inline = [
      "echo '${aws_instance.master-instance.private_ip} master' | sudo tee -a /etc/hosts",
      "echo '${aws_instance.worker1-instance.private_ip} worker1' | sudo tee -a /etc/hosts",
      "echo '${aws_instance.worker2-instance.private_ip} worker2' | sudo tee -a /etc/hosts"
    ]

    connection {
      type        = "ssh"
      user        = var.login_user
      private_key = file("${path.module}/chatapp")
      host        = aws_instance.worker2-instance.public_ip
    }
  }
}
