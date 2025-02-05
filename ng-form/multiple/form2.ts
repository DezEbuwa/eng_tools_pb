// network-config.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

interface Subnet {
  name: string;
  cidr: string;
  description: string;
}

interface FirewallRule {
  name: string;
  sourceIp: string;
  destinationIp: string;
  port: number;
  protocol: string;
}

@Component({
  selector: 'app-network-config',
  templateUrl: './network-config.component.html',
  styleUrls: ['./network-config.component.scss']
})
export class NetworkConfigComponent implements OnInit {
  configForm: FormGroup;
  
  // Table configurations
  subnetColumns: string[] = ['name', 'cidr', 'description', 'actions'];
  firewallColumns: string[] = ['name', 'sourceIp', 'destinationIp', 'port', 'protocol', 'actions'];
  
  subnetDataSource = new MatTableDataSource<Subnet>([]);
  firewallDataSource = new MatTableDataSource<FirewallRule>([]);

  constructor(private fb: FormBuilder) {
    this.configForm = this.fb.group({
      // Add any form controls you need
    });
  }

  ngOnInit() {
    // Initialize with any existing data if needed
    this.subnetDataSource.data = [
      { name: 'Subnet-1', cidr: '10.0.0.0/24', description: 'Primary subnet' }
    ];
    
    this.firewallDataSource.data = [
      { name: 'Rule-1', sourceIp: '0.0.0.0/0', destinationIp: '10.0.0.0/24', port: 80, protocol: 'TCP' }
    ];
  }

  addSubnet() {
    const newSubnet: Subnet = {
      name: `Subnet-${this.subnetDataSource.data.length + 1}`,
      cidr: '',
      description: ''
    };
    
    // Create a new array with the existing data plus the new subnet
    const currentData = this.subnetDataSource.data;
    this.subnetDataSource.data = [...currentData, newSubnet];
  }

  addFirewallRule() {
    const newRule: FirewallRule = {
      name: `Rule-${this.firewallDataSource.data.length + 1}`,
      sourceIp: '',
      destinationIp: '',
      port: 0,
      protocol: 'TCP'
    };
    
    // Create a new array with the existing data plus the new rule
    const currentData = this.firewallDataSource.data;
    this.firewallDataSource.data = [...currentData, newRule];
  }

  removeSubnet(index: number) {
    const currentData = this.subnetDataSource.data;
    currentData.splice(index, 1);
    this.subnetDataSource.data = [...currentData];
  }

  removeFirewallRule(index: number) {
    const currentData = this.firewallDataSource.data;
    currentData.splice(index, 1);
    this.firewallDataSource.data = [...currentData];
  }

  onSubmit() {
    if (this.configForm.valid) {
      const formData = {
        ...this.configForm.value,
        subnets: this.subnetDataSource.data,
        firewallRules: this.firewallDataSource.data
      };
      console.log('Form submitted:', formData);
    }
  }
}
