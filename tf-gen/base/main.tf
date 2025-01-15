provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "newteam_rg" {
  name     = "newteam_rg"
  location = "East US"
}

resource "azurerm_virtual_network" "newteam_vnet" {
  name                = "newteam-vnet"
  location            = azurerm_resource_group.newteam_rg.location
  resource_group_name = azurerm_resource_group.newteam_rg.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "newteam_subnet" {
  name                 = "default"
  resource_group_name  = azurerm_resource_group.newteam_rg.name
  virtual_network_name = azurerm_virtual_network.newteam_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_security_group" "newteam_sg" {
  name                = "newteam_sg"
  location            = azurerm_resource_group.newteam_rg.location
  resource_group_name = azurerm_resource_group.newteam_rg.name
}

resource "azurerm_network_security_rule" "allow_http" {
  name                        = "AllowHTTP"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "80"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.newteam_sg.name
  resource_group_name         = azurerm_resource_group.newteam_rg.name
}

resource "azurerm_network_security_rule" "allow_https" {
  name                        = "AllowHTTPS"
  priority                    = 110
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.newteam_sg.name
  resource_group_name         = azurerm_resource_group.newteam_rg.name
}

resource "azurerm_network_security_rule" "allow_ssh" {
  name                        = "AllowSSH"
  priority                    = 120
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.newteam_sg.name
  resource_group_name         = azurerm_resource_group.newteam_rg.name
}
