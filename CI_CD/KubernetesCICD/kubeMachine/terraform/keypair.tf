resource "aws_key_pair" "chatapp-keypair" {
  key_name = "chatapp-keypair"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIMZtYWReVQbXbXMzjp7voyFuOjfLijSExFFEVXiCb48 sathish@archlinux"
}
