resource "azurerm_network_interface" "newteam_nic" {
  count               = 3
  name                = "rhel9-vm${count.index + 1}-nic"
  location            = azurerm_resource_group.newteam_rg.location
  resource_group_name = azurerm_resource_group.newteam_rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.newteam_subnet.id
    private_ip_address_allocation = "Dynamic"
  }

  network_security_group_id = azurerm_network_security_group.newteam_sg.id
}
