resource "aws_instance" "worker1-instance" {
  ami                    = "ami-0b6d9d3d33ba97d99"
  instance_type          = "t3.small"
  key_name               = "chatapp-keypair"
  vpc_security_group_ids = [aws_security_group.k8s_workers.id]

  tags = {
    Name = "worker1"
  }

  provisioner "file" {
    source      = "../scripts/global.sh"
    destination = "/tmp/global.sh"
  }

  connection {
    type        = "ssh"
    user        = var.login_user
    private_key = file("chatapp")
    host        = self.public_ip
  }

   provisioner "remote-exec" {
     inline = [
       "sudo chmod +x /tmp/global.sh",
       "sudo /tmp/global.sh"
     ]
   }
}

resource "aws_ec2_instance_state" "worker1-instance-state" {
  instance_id = aws_instance.worker1-instance.id
  state       = "running"
}

output "worker1_instance_public_ip" {
  description = "Getting the isntance public ip for ssh login"
  value       = aws_instance.worker1-instance.public_ip
}
