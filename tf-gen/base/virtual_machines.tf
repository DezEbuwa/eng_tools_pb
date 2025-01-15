resource "azurerm_linux_virtual_machine" "rhel9_vms" {
  count                = 3
  name                 = "rhel9-vm${count.index + 1}"
  location             = azurerm_resource_group.newteam_rg.location
  resource_group_name  = azurerm_resource_group.newteam_rg.name
  size                 = "Standard_B1s"
  admin_username       = "adminuser"
  network_interface_ids = [azurerm_network_interface.newteam_nic[count.index].id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    name                 = "rhel9-vm${count.index + 1}-osdisk"
  }

  source_image_reference {
    publisher = "RedHat"
    offer     = "RHEL"
    sku       = "9-lvm-gen2"
    version   = "latest"
  }

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }
}
