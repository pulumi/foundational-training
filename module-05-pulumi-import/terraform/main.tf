terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

data "aws_region" "current" {}

locals {
  name = "convert-tf"
  azs = [
    "${data.aws_region.current.name}a",
    "${data.aws_region.current.name}b",
    "${data.aws_region.current.name}c",
  ]
}

provider "aws" {
  default_tags {
    tags = {
      Source = local.name
      Name   = local.name
    }
  }
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = local.name
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "convert-tf"
  }
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public Subnet CIDR values"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private Subnet CIDR values"
  default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  availability_zone = element(local.azs, count.index)
  cidr_block        = element(var.public_subnet_cidrs, count.index)
  tags = {
    Name = "convert-tf-public-${count.index + 1}"
  }
}

resource "aws_route_table" "public" {
  count  = length(var.public_subnet_cidrs)
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "convert-tf-public-${count.index + 1}"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = element(aws_subnet.public[*].id, count.index)
  route_table_id = aws_route_table.public[0].id
}

resource "aws_route" "public_internet_gateway" {
  count                  = length(aws_subnet.public)
  route_table_id         = aws_route_table.public[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id

  timeouts {
    create = "5m"
  }
}

resource "aws_eip" "eip" {}

resource "aws_nat_gateway" "natgw" {
  subnet_id     = aws_subnet.public[0].id
  allocation_id = aws_eip.eip.allocation_id
  tags = {
    Name = local.name
  }
  depends_on = [aws_internet_gateway.igw]
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  availability_zone = element(local.azs, count.index)
  cidr_block        = element(var.private_subnet_cidrs, count.index)
  tags = {
    Name = "convert-tf-private-${count.index + 1}"
  }
}

resource "aws_route_table" "private" {
  count  = length(aws_subnet.public)
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "convert-tf-private"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(var.private_subnet_cidrs)
  subnet_id      = element(aws_subnet.private[*].id, count.index)
  route_table_id = aws_route_table.private[count.index].id
}

resource "aws_route" "private_nat_gateway" {
  count                  = length(aws_subnet.public)
  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.natgw.id

  timeouts {
    create = "5m"
  }
}
