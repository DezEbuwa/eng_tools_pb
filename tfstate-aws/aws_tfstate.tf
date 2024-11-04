terraform {
  backend "s3" {
    bucket         = "your-s3-bucket-name"         # Replace with your S3 bucket name
    key            = "path/to/your/tfstate/file.tfstate"  # Replace with desired path in the bucket
    region         = "your-region"                 # Replace with your AWS region (e.g., us-west-1)
    encrypt        = true                          # Enable server-side encryption
    dynamodb_table = "your-lock-table"             # Replace with your DynamoDB table for locking
  }
}

provider "aws" {
  region = "your-region"                           # Replace with your AWS region
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "your-s3-bucket-name"
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_dynamodb_table" "terraform_lock" {
  name           = "your-lock-table"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
