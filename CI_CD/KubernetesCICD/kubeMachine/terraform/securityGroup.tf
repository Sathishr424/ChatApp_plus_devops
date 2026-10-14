# =========================
# Control Plane Security Group
# =========================

resource "aws_security_group" "k8s_control_plane" {
  name        = "k8s-control-plane"
  description = "Security group for Kubernetes control plane"

  # Outbound
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "k8s-control-plane"
  }
}


# =========================
# Worker Security Group
# =========================

resource "aws_security_group" "k8s_workers" {
  name        = "k8s-workers"
  description = "Security group for Kubernetes worker nodes"

  # Outbound
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "k8s-workers"
  }
}


# ============================================================
# CONTROL PLANE INGRESS RULES
# ============================================================

# Workers -> Kubernetes API Server
resource "aws_vpc_security_group_ingress_rule" "workers_to_api_server" {
  security_group_id            = aws_security_group.k8s_control_plane.id
  referenced_security_group_id = aws_security_group.k8s_workers.id

  description = "Workers to Kubernetes control plane - all traffic"
  ip_protocol = "-1"
}

# SSH -> Control Plane
resource "aws_vpc_security_group_ingress_rule" "control_plane_ssh" {
  security_group_id = aws_security_group.k8s_control_plane.id

  description = "SSH access to control plane"
  cidr_ipv4   = "183.82.24.223/32"
  from_port   = 22
  to_port     = 22
  ip_protocol = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "all_from_myip" {
  security_group_id = aws_security_group.k8s_control_plane.id

  description = "All traffic from my IP"
  cidr_ipv4   = "183.82.24.223/32"
  ip_protocol = "-1"
}

# Your machine -> Kubernetes API Server
resource "aws_vpc_security_group_ingress_rule" "admin_to_api_server" {
  security_group_id = aws_security_group.k8s_control_plane.id

  description = "kubectl access to Kubernetes API server"
  cidr_ipv4   = "183.82.24.223/32"
  from_port   = 6443
  to_port     = 6443
  ip_protocol = "tcp"
}


# ============================================================
# WORKER INGRESS RULES
# ============================================================

# Control Plane -> Worker Kubelet
resource "aws_vpc_security_group_ingress_rule" "control_plane_to_workers_kubelet" {
  security_group_id            = aws_security_group.k8s_workers.id
  referenced_security_group_id = aws_security_group.k8s_control_plane.id

  description = "Workers to Kubernetes control plane - all traffic"
  ip_protocol = "-1"
}

resource "aws_vpc_security_group_ingress_rule" "workers_to_workers_kubelet" {
  security_group_id            = aws_security_group.k8s_workers.id
  referenced_security_group_id = aws_security_group.k8s_workers.id

  description = "Workers to workers - all traffic"
  ip_protocol = "-1"
}

# SSH -> Workers
resource "aws_vpc_security_group_ingress_rule" "workers_ssh" {
  security_group_id = aws_security_group.k8s_workers.id

  description = "SSH access to workers"
  cidr_ipv4   = "183.82.24.223/32"
  from_port   = 22
  to_port     = 22
  ip_protocol = "tcp"
}
