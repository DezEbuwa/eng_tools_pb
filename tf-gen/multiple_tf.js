const { TerraformGenerator, ResourceGroup, VirtualNetwork, Subnet, NetworkSecurityGroup, SecurityRule, NetworkInterface, VirtualMachine } = require('terraform-generator');

// Your JSON configuration
const config = {
  resourceGroupName: "example-rg",
  location: "eastus",
  virtualMachines: [
    { name: "rhel9-vm1", size: "Standard_B1s", adminUsername: "adminuser" },
    { name: "rhel9-vm2", size: "Standard_B1s", adminUsername: "adminuser" },
  ],
  vnet: {
    name: "example-vnet",
    addressSpace: ["10.0.0.0/16"],
    subnets: [
      { name: "default", addressPrefix: "10.0.1.0/24" },
    ],
  },
  securityGroup: {
    name: "example-nsg",
    rules: [
      {
        name: "AllowSSH",
        priority: 100,
        direction: "Inbound",
        access: "Allow",
        protocol: "Tcp",
        sourcePortRange: "*",
        destinationPortRange: "22",
        sourceAddressPrefix: "*",
        destinationAddressPrefix: "*",
      },
    ],
  },
};

// Initialize Terraform generator
const tf = new TerraformGenerator();

// Resource Group
const rg = new ResourceGroup(tf, "rg", {
  name: config.resourceGroupName,
  location: config.location,
});

// Virtual Network
const vnet = new VirtualNetwork(tf, "vnet", {
  name: config.vnet.name,
  location: config.location,
  resource_group_name: rg.name,
  address_space: config.vnet.addressSpace,
});

// Subnet
const subnet = new Subnet(tf, "subnet", {
  name: config.vnet.subnets[0].name,
  virtual_network_name: vnet.name,
  resource_group_name: rg.name,
  address_prefix: config.vnet.subnets[0].addressPrefix,
});

// Network Security Group
const nsg = new NetworkSecurityGroup(tf, "nsg", {
  name: config.securityGroup.name,
  location: config.location,
  resource_group_name: rg.name,
});

config.securityGroup.rules.forEach((rule, index) => {
  new SecurityRule(tf, `rule${index + 1}`, {
    name: rule.name,
    priority: rule.priority,
    direction: rule.direction,
    access: rule.access,
    protocol: rule.protocol,
    source_port_range: rule.sourcePortRange,
    destination_port_range: rule.destinationPortRange,
    source_address_prefix: rule.sourceAddressPrefix,
    destination_address_prefix: rule.destinationAddressPrefix,
    network_security_group_name: nsg.name,
    resource_group_name: rg.name,
  });
});

// Network Interfaces and Virtual Machines
config.virtualMachines.forEach((vm, index) => {
  const nic = new NetworkInterface(tf, `nic${index + 1}`, {
    name: `${vm.name}-nic`,
    location: config.location,
    resource_group_name: rg.name,
    ip_configuration: {
      name: `${vm.name}-ipconfig`,
      subnet_id: subnet.id,
    },
    network_security_group_id: nsg.id,
  });

  new VirtualMachine(tf, `vm${index + 1}`, {
    name: vm.name,
    location: config.location,
    resource_group_name: rg.name,
    size: vm.size,
    admin_username: vm.adminUsername,
    os_disk: {
      name: `${vm.name}-osdisk`,
      caching: "ReadWrite",
      create_option: "FromImage",
    },
    network_interface_ids: [nic.id],
    source_image_reference: {
      publisher: "RedHat",
      offer: "RHEL",
      sku: "9-lvm-gen2",
      version: "latest",
    },
  });
});

// Generate Terraform code into separate files
tf.writeToFiles({
  "./output/resource_group.tf": [rg],
  "./output/network.tf": [vnet, subnet, nsg],
  "./output/security_rules.tf": config.securityGroup.rules.map((_, i) => tf.getResource(`rule${i + 1}`)),
  "./output/virtual_machines.tf": config.virtualMachines.map((_, i) => tf.getResource(`vm${i + 1}`)),
  "./output/network_interfaces.tf": config.virtualMachines.map((_, i) => tf.getResource(`nic${i + 1}`)),
});
