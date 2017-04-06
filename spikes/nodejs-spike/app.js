let restify = require('restify');
let validation = require('./templates/validation.js');
let virtualNetwork = require('./templates/virtualNetworkSettings.js');
let routeTables = require('./templates/routeTableSettings.js');
let r = require('./templates/resources.js');
let avSet = require('./templates/availabilitySetSettings.js');


let s = "<WadCfg><DiagnosticMonitorConfiguration overallQuotaInMB=\"4096\"><DiagnosticInfrastructureLogs scheduledTransferPeriod=\"PT1M\" scheduledTransferLogLevelFilter=\"Warning\"/>";


let virtualNetworkSettingsWithPeering = [
  {
    name: "my-virtual-network",
    addressPrefixes: [
      "10.0.0.0/16"
    ],
    subnets: [
      {
        name: "web",
        addressPrefix: "10.0.1.0/24"
      },
      {
        name: "biz",
        addressPrefix: "10.0.2.0/24"
      }
    ],
    dnsServers: [],
    virtualNetworkPeerings: [
      {
        remoteVirtualNetwork: {
          //name: "my-other-virtual-network"
        },
        allowForwardedTraffic: true,
        allowGatewayTransit: true,
        useRemoteGateways: false
      },
      {
        remoteVirtualNetwork: {
          name: "my-other-virtual-network"
        },
        allowForwardedTraffic: true,
        allowGatewayTransit: true,
        useRemoteGateways: false
      }
    ]
  },
  {
    name: "my-other-virtual-network",
    addressPrefixes: [
      "10.0.0.0/16"
    ],
    subnets: [
      {
        name: "web",
        addressPrefix: "10.0.1.0/24"
      },
      {
        name: "biz",
        addressPrefix: "10.0.2.0/24"
      }
    ],
    dnsServers: [],
    virtualNetworkPeerings: []
  }
];

let virtualNetworkSettings = [
  {
    name: "my-virtual-network",
    addressPrefixes: [
      "10.0.0.0/16"
    ],
    subnets: [
      {
        name: "web",
        addressPrefix: "10.0.1.0/24"
      },
      {
        name: "biz",
        addressPrefix: "10.0.2.0/24"
      }
    ],
    dnsServers: []
  },
  {
    name: "my-other-virtual-network",
    addressPrefixes: [
      "10.0.0.0/16"
    ],
    subnets: [
      {
        name: "web",
        addressPrefix: "10.0.1.0/24"
      },
      {
        name: "biz",
        addressPrefix: "10.0.2.0/24"
      }
    ],
    dnsServers: []
  }
];

function vnetTests(req, res, next) {
  let { settings, validationErrors } = virtualNetwork.transform({
    //settings: virtualNetworkSettings,
    settings: virtualNetworkSettingsWithPeering,
    buildingBlockSettings: {
      subscriptionId: "49741165-F4AF-456E-B47C-637AEAB82D50",
      resourceGroupName: "my-resource-group"
    }
  });

  if (validationErrors) {
    res.send(400, validationErrors);
  } else {
    res.send(settings);
  }
  next();
}

let routeTableSettings = [
  {
    name: "route-rt",
    virtualNetworks: [
      {
        name: "my-virtual-network",
        subnets: ["web", "biz"]
      },
      {
        name: "my-other-virtual-network",
        subnets: ["web"]
      }
    ],
    routes: [
      {
        name: "route1",
        addressPrefix: "10.0.1.0/24",
        nextHopType: "VnetLocal"
      },
      {
        name: "route2",
        addressPrefix: "10.0.2.0/24",
        nextHopType: "VirtualNetworkGateway"
      },
      {
        name: "route3",
        addressPrefix: "10.0.3.0/24",
        nextHopType: "VirtualAppliance",
        nextHopIpAddress: "192.168.1.1"
      }
    ]
  }
];

let routeTableSettings2 = {
  name: "route-rt",
  virtualNetworks: [
    {
      name: "my-virtual-network",
      subnets: ["web", "biz"]
    },
    {
      name: "my-other-virtual-network",
      subnets: ["web"]
    }
  ],
  routes: [
    {
      name: "route1",
      addressPrefix: "10.0.1.0/24",
      nextHopType: "VnetLocal"
    },
    {
      name: "route2",
      addressPrefix: "10.0.2.0/24",
      nextHopType: "VirtualNetworkGateway"
    },
    {
      name: "route3",
      addressPrefix: "10.0.3.0/24",
      nextHopType: "VirtualAppliance",
      nextHopIpAddress: "192.168.1.1"
    }
  ]
};

function routeTableTests(req, res, next) {
  routeTableSettings.push(routeTableSettings2);
  let { settings, validationErrors } = routeTables.transform({
    //settings: routeTableSettings2,
    settings: routeTableSettings,
    buildingBlockSettings: {
      subscriptionId: "3b518fac-e5c8-4f59-8ed5-d70b626f8e10",
      resourceGroupName: "template-v2-rg"
    }
  });

  if (validationErrors) {
    res.send(400, validationErrors);
  } else {
    res.send(settings);
  }

  next();
}

//var server = restify.createServer();
// server.get('/virtualNetwork', vnetTests);
// server.get('/routeTable', routeTableTests);

let vmSettings = require('./templates/virtualMachineSettings.js');

var virtualMachinesSettings = {
  "vNetName": "testvnet",
  "vmCount": 2,
  "namePrefix": "test",
  "computerNamePrefix": "test",
  "osType": "linux",
  "adminUsername": "adminUser",
  "adminPassword": "uuuuuuuu",
  "osAuthenticationType": "password",
  "storageAccounts": {

  },
  "nics": [
    {
      "isPublic": "true",
      "subnetName": "web",
      "privateIPAllocationMethod": "Static",

      "startingIPAddress": "10.0.1.240",

      "domainNameLabelPrefix": "bb-dev-dns",

      "isPrimary": true
    },
    {
      "subnetName": "biz",
      "privateIPAllocationMethod": "Static",

      "startingIPAddress": "10.0.2.240",
      "enableIPForwarding": true,


      "isPrimary": false
    }
  ],
  "extensions": [
    {
      "name": "malware",
      "publisher": "Symantec",
      "type": "SymantecEndpointProtection",
      "typeHandlerVersion": "12.1",
      "autoUpgradeMinorVersion": true,
      "settingsConfigMapperUri": "https://raw.githubusercontent.com/mspnp/template-building-blocks/master/templates/resources/Microsoft.Compute/virtualMachines/extensions/vm-extension-passthrough-settings-mapper.json",
      "settingsConfig": {},
      "protectedSettingsConfig": {}
    }
  ],
  "dataDisks": {
    "count": 2,
    "properties": {
      "diskSizeGB": 127,
    }
  },
  "availabilitySet": {
    "useExistingAvailabilitySet": "No",
    "name": "test-as"
  }
};

let buildingBlockSettings = {
  "resourceGroup": "rg1",
  "subscription": "76D54A21-DB2D-4BE5-AA87-806BD9AD08DD"
}

let settings = vmSettings.mergeWithDefaults(virtualMachinesSettings);
//if (validationErrors) console.log(validationErrors);
//console.log(JSON.stringify(settings));

let validationErrors = vmSettings.validateSettings(settings);
console.log(validationErrors);

let vmParams = vmSettings.processVirtualMachineSettings(settings, buildingBlockSettings);
console.log(JSON.stringify(vmParams));
