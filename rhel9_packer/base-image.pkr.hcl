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
  disk_size               = "20G"

  iso_url                 = "./iso/rhel-9.4-x86_64-boot.iso"
  iso_checksum            = "daa36812edbc4933f9d210dc6be09694a423f9290da39c9bd65c4347e59f3a1b094eb87d223af3f209f5a472c70e3fba671e32f94055d9a5c9d4f08b1b22a479"

  communicator            = "ssh"
  ssh_timeout             = "1h"
  ssh_username            = "root"
  ssh_password            = "P@ssw0rdP@ssw0rd"
  ssh_port                = 5995
  qemu_binary             = "/usr/libexec/qemu-kvm"
  skip_nat_mapping        = true
  pause_before_connecting = "1m"

  output_directory        = "output"

  // VNC Section
  vnc_port_min = 5999 # Minimum/Maximum VNC port number to use
  vnc_port_max = 5999

  // HTTP Section
  http_port_min = 8099 # Minimum/Maximum HTTP port number to use
  http_port_max = 8099


  boot_wait = "1m"

  boot_command            = [
    "<up>",
    "<tab>",
    "<end><wait>",
    " inst.text inst.ks=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ks.cfg",
    "<enter><wait><leftCtrlOn>x<leftCtrlOff><wait1m>"
  ]


  accelerator = "kvm"

  format                  = "qcow2"
  use_backing_file        = false
  disk_image              = true
  disk_compression        = true

  headless                = true
  use_default_display     = false
  vnc_bind_address        = "127.0.0.1"

  net_device              = "virtio-net"
  disk_interface          = "virtio"

  cd_files = ["cloud-init/user-data", "cloud-init/meta-data", "cloud-init/network-config"]
  cd_label = "cidata"

  qemuargs = [
    ["-serial", "mon:stdio"],
    [ "-netdev", "user,hostfwd=tcp::{{ .SSHHostPort }}-:22,id=forward"],
    [ "-device", "virtio-net,netdev=forward,id=net0"]
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
