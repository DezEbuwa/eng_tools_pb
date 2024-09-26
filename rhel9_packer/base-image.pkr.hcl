packer {
  required_plugins {
    qemu = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/qemu"
    }
    ansible = {
      version = ">= 1.1.1"
      source  = "github.com/hashicorp/ansible"
    }
  }
}

source "qemu" "template" {
  vm_name                 = "galaxy-rhel9-vm.qcow2"
  cpus                    = "2"
  memory                  = "2048"
  disk_size               = "40G"

  iso_url                 = "./iso/rhel9_soft.qcow2"
  iso_checksum            = "334054290e6c841abed6a06fe44640cf5649ca30d7a4eb2a46395aa7c919e286"

  communicator            = "ssh"
  ssh_timeout             = "1h"
  ssh_username            = "galaxyadmin"
  ssh_password            = "P@ssw0rdP@ssw0rd"
  ssh_port                = 2222
  qemu_binary             = "/usr/bin/qemu-kvm"
  skip_nat_mapping        = true
  pause_before_connecting = "1m"

  output_directory        = "output"

  // VNC Section
  vnc_port_min = 5900 # Minimum/Maximum VNC port number to use
  vnc_port_max = 5999

  // HTTP Section
  http_directory          = "http"
  http_port_min           = 8099 # Minimum/Maximum HTTP port number to use
  http_port_max           = 8199


  boot_wait = "2m"

  boot_command            = [
    "inst.text inst.ks=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ks.cfg<enter><wait>"
  ]


  accelerator = "kvm"

  format                  = "qcow2"
  use_backing_file        = false
  disk_image              = true
  disk_compression        = false

  headless                = true
  use_default_display     = false
  vnc_bind_address        = "127.0.0.1"

  net_device              = "virtio-net"
  disk_interface          = "virtio-scsi"
  disk_cache              = "unsafe"
  disk_discard            = "unmap"
  disk_detect_zeroes      = "unmap"


  cd_files = ["./http/ks.cfg","cloud-init/user-data", "cloud-init/meta-data", "cloud-init/network-config"]
  cd_label = "cidata"

  qemuargs = [
    [
      "-cpu",
      "host,x2apic=on,tsc-deadline=on,hypervisor=on,tsc-adjust=on,erms=on,vaes=on,vpclmulqdq=on,",
      "spec-ctrl=on,stibp=on,arch-capabilities=on,ssbd=on,xsaves=on,ibrs=on,",
      "amd-ssbd=on,skip-l1dfl-vmentry=on,pschange-mc-no=on"
    ]
  ]

  shutdown_command        = "shutdown -P now"
}

build {
  sources = ["source.qemu.template"]

  # wait for cloud-init to successfully finish
  provisioner "shell" {
    inline = [
      "cloud-init status --wait > /dev/null 2>&1"
    ]
  }

  provisioner "ansible-local" {
    playbook_file = "ansible/playbook.yml"
  }
}
