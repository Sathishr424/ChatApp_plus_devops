resource "aws_instance" "machine01-instance" {
  ami                    = "ami-0b6d9d3d33ba97d99"
  instance_type          = "t3.micro"
  key_name               = "chatapp-keypair"
  vpc_security_group_ids = ["sg-07e9f1bfd5533afad"]

  tags = {
    Name = "machine01"
  }

  provisioner "file" {
    source      = "./scripts/provision.sh"
    destination = "/tmp/provision.sh"
  }

  connection {
    type        = "ssh"
    user        = var.login_user
    private_key = file("chatapp")
    host        = self.public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /tmp/provision.sh",
      "sudo /tmp/provision.sh",
    ]
  }
}

resource "aws_ec2_instance_state" "machine01-instance-state" {
  instance_id = aws_instance.machine01-instance.id
  state       = "running"
}

output "machine01_instance_public_ip" {
  description = "Getting the isntance public ip for ssh login"
  value       = aws_instance.machine01-instance.public_ip
}
