resource "aws_instance" "master-instance" {
  ami                    = "ami-0b6d9d3d33ba97d99"
  instance_type          = "c7i-flex.large"
  key_name               = "chatapp-keypair"
  vpc_security_group_ids = [aws_security_group.k8s_control_plane.id]

  tags = {
    Name = "master"
  }

  provisioner "file" {
    source      = "../scripts/global.sh"
    destination = "/tmp/global.sh"
  }

  provisioner "file" {
    source      = "../scripts/master.sh"
    destination = "/tmp/master.sh"
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
       "sudo /tmp/global.sh",
       "sudo chmod +x /tmp/master.sh",
       "sudo /tmp/master.sh",
     ]
   }
}

resource "aws_ec2_instance_state" "master-instance-state" {
  instance_id = aws_instance.master-instance.id
  state       = "running"
}

output "master_instance_public_ip" {
  description = "Getting the isntance public ip for ssh login"
  value       = aws_instance.master-instance.public_ip
}
