

// Please copy the following code into your Pulumi application. Not doing so
// will cause Pulumi to report that an update will happen on the next update command.

// Please note that the imported resources are marked as protected. To destroy them
// you will need to remove the `protect` option and run `pulumi update` *before*
// the destroy will take effect.

import * as aws from "@pulumi/aws";

const CdkStack_cf_exercise_vpc_0592b542a3d08a14b = new aws.ec2.Vpc("CdkStack/cf-exercise-vpc-0592b542a3d08a14b", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    instanceTenancy: "default",
    tags: {
        Name: "CdkStack/cf-exercise",
    },
}, {
    protect: true,
});
const import_vpc_aef2a7d4 = new aws.ec2.Vpc("import-vpc-aef2a7d4", {
    cidrBlock: "172.31.0.0/16",
    enableDnsHostnames: true,
    instanceTenancy: "default",
}, {
    protect: true,
});
const import_subnet_933035cf = new aws.ec2.Subnet("import-subnet-933035cf", {
    // availabilityZone: "us-east-1c",
    availabilityZoneId: "use1-az6",
    cidrBlock: "172.31.32.0/20",
    mapPublicIpOnLaunch: true,
    privateDnsHostnameTypeOnLaunch: "ip-name",
    vpcId: "vpc-aef2a7d4",
}, {
    protect: true,
});
const CdkStack_cf_exercise_PrivateSubnet1_subnet_0a87f6ea77d3c3321 = new aws.ec2.Subnet("CdkStack/cf-exercise/PrivateSubnet1-subnet-0a87f6ea77d3c3321", {
    // availabilityZone: "us-east-1a",
    availabilityZoneId: "use1-az2",
    cidrBlock: "10.0.128.0/18",
    privateDnsHostnameTypeOnLaunch: "ip-name",
    tags: {
        Name: "CdkStack/cf-exercise/PrivateSubnet1",
        "aws-cdk:subnet-name": "Private",
        "aws-cdk:subnet-type": "Private",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
// const CdkStack_cf_exercise_PublicSubnet1_subnet_01091c0d13b0f5af5 = new aws.ec2.Subnet("CdkStack/cf-exercise/PublicSubnet1-subnet-01091c0d13b0f5af5", {
//     availabilityZone: "us-east-1a",
//     availabilityZoneId: "use1-az2",
//     cidrBlock: "10.0.0.0/18",
//     mapPublicIpOnLaunch: true,
//     privateDnsHostnameTypeOnLaunch: "ip-name",
//     tags: {
//         Name: "CdkStack/cf-exercise/PublicSubnet1",
//         "aws-cdk:subnet-name": "Public",
//         "aws-cdk:subnet-type": "Public",
//     },
//     vpcId: "vpc-0592b542a3d08a14b",
// }, {
//     protect: true,
// });
const CdkStack_cf_exercise_PrivateSubnet2_subnet_0717b436cd86bdc60 = new aws.ec2.Subnet("CdkStack/cf-exercise/PrivateSubnet2-subnet-0717b436cd86bdc60", {
    // availabilityZone: "us-east-1b",
    availabilityZoneId: "use1-az4",
    cidrBlock: "10.0.192.0/18",
    privateDnsHostnameTypeOnLaunch: "ip-name",
    tags: {
        Name: "CdkStack/cf-exercise/PrivateSubnet2",
        "aws-cdk:subnet-name": "Private",
        "aws-cdk:subnet-type": "Private",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const CdkStack_cf_exercise_PublicSubnet2_subnet_0a174b6073a912bce = new aws.ec2.Subnet("CdkStack/cf-exercise/PublicSubnet2-subnet-0a174b6073a912bce", {
    // availabilityZone: "us-east-1b",
    availabilityZoneId: "use1-az4",
    cidrBlock: "10.0.64.0/18",
    mapPublicIpOnLaunch: true,
    privateDnsHostnameTypeOnLaunch: "ip-name",
    tags: {
        Name: "CdkStack/cf-exercise/PublicSubnet2",
        "aws-cdk:subnet-name": "Public",
        "aws-cdk:subnet-type": "Public",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const import_subnet_549cd06a = new aws.ec2.Subnet("import-subnet-549cd06a", {
    // availabilityZone: "us-east-1e",
    availabilityZoneId: "use1-az3",
    cidrBlock: "172.31.64.0/20",
    mapPublicIpOnLaunch: true,
    privateDnsHostnameTypeOnLaunch: "ip-name",
    vpcId: "vpc-aef2a7d4",
}, {
    protect: true,
});
const import_subnet_51d61e1c = new aws.ec2.Subnet("import-subnet-51d61e1c", {
    // availabilityZone: "us-east-1b",
    availabilityZoneId: "use1-az4",
    cidrBlock: "172.31.16.0/20",
    mapPublicIpOnLaunch: true,
    privateDnsHostnameTypeOnLaunch: "ip-name",
    vpcId: "vpc-aef2a7d4",
}, {
    protect: true,
});
const import_subnet_57f60459 = new aws.ec2.Subnet("import-subnet-57f60459", {
    // availabilityZone: "us-east-1f",
    availabilityZoneId: "use1-az5",
    cidrBlock: "172.31.48.0/20",
    mapPublicIpOnLaunch: true,
    privateDnsHostnameTypeOnLaunch: "ip-name",
    vpcId: "vpc-aef2a7d4",
}, {
    protect: true,
});

const CdkStack_cf_exercise_PublicSubnet2_rtb_01525d7977d2ade83 = new aws.ec2.RouteTable("CdkStack/cf-exercise/PublicSubnet2-rtb-01525d7977d2ade83", {
    routes: [{
        cidrBlock: "0.0.0.0/0",
        gatewayId: "igw-05fade4bd42452444",
    }],
    tags: {
        Name: "CdkStack/cf-exercise/PublicSubnet2",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const CdkStack_cf_exercise_PrivateSubnet1_rtb_0f9fbf7927832d3fe = new aws.ec2.RouteTable("CdkStack/cf-exercise/PrivateSubnet1-rtb-0f9fbf7927832d3fe", {
    routes: [{
        cidrBlock: "0.0.0.0/0",
        natGatewayId: "nat-018d9c98d870fe551",
    }],
    tags: {
        Name: "CdkStack/cf-exercise/PrivateSubnet1",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const CdkStack_cf_exercise_PublicSubnet1_rtb_07b9c8783418f7a7c = new aws.ec2.RouteTable("CdkStack/cf-exercise/PublicSubnet1-rtb-07b9c8783418f7a7c", {
    routes: [{
        cidrBlock: "0.0.0.0/0",
        gatewayId: "igw-05fade4bd42452444",
    }],
    tags: {
        Name: "CdkStack/cf-exercise/PublicSubnet1",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const import_rtb_4679a938 = new aws.ec2.RouteTable("import-rtb-4679a938", {
    routes: [{
        cidrBlock: "0.0.0.0/0",
        gatewayId: "igw-5e62da25",
    }],
    vpcId: "vpc-aef2a7d4",
}, {
    protect: true,
});
const CdkStack_cf_exercise_PrivateSubnet2_rtb_046ebd144d34ce5a7 = new aws.ec2.RouteTable("CdkStack/cf-exercise/PrivateSubnet2-rtb-046ebd144d34ce5a7", {
    routes: [{
        cidrBlock: "0.0.0.0/0",
        natGatewayId: "nat-018d9c98d870fe551",
    }],
    tags: {
        Name: "CdkStack/cf-exercise/PrivateSubnet2",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const import_rtb_032cd87707544bb99 = new aws.ec2.RouteTable("import-rtb-032cd87707544bb99", {vpcId: "vpc-0592b542a3d08a14b"}, {
    protect: true,
});
const CdkStack_cf_exercise_PublicSubnet1_nat_018d9c98d870fe551 = new aws.ec2.NatGateway("CdkStack/cf-exercise/PublicSubnet1-nat-018d9c98d870fe551", {
    allocationId: "eipalloc-05c44fefc4b66689d",
    privateIp: "10.0.36.128",
    subnetId: "subnet-01091c0d13b0f5af5",
    tags: {
        Name: "CdkStack/cf-exercise/PublicSubnet1",
    },
}, {
    protect: true,
});
const CdkStack_cf_exercise_igw_05fade4bd42452444 = new aws.ec2.InternetGateway("CdkStack/cf-exercise-igw-05fade4bd42452444", {
    tags: {
        Name: "CdkStack/cf-exercise",
    },
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const import_igw_5e62da25 = new aws.ec2.InternetGateway("import-igw-5e62da25", {vpcId: "vpc-aef2a7d4"}, {
    protect: true,
});
const import_rtbassoc_0780527bddee27f54 = new aws.ec2.RouteTableAssociation("import-rtbassoc-0780527bddee27f54", {
    routeTableId: "rtb-01525d7977d2ade83",
    subnetId: "subnet-0a174b6073a912bce",
}, {
    protect: true,
});
const import_rtbassoc_056e7836528eea9a8 = new aws.ec2.RouteTableAssociation("import-rtbassoc-056e7836528eea9a8", {
    routeTableId: "rtb-0f9fbf7927832d3fe",
    subnetId: "subnet-0a87f6ea77d3c3321",
}, {
    protect: true,
});
const import_rtbassoc_07c051a9a2d9384c6 = new aws.ec2.RouteTableAssociation("import-rtbassoc-07c051a9a2d9384c6", {
    routeTableId: "rtb-07b9c8783418f7a7c",
    subnetId: "subnet-01091c0d13b0f5af5",
}, {
    protect: true,
});
const import_rtbassoc_005a0f048e2052832 = new aws.ec2.RouteTableAssociation("import-rtbassoc-005a0f048e2052832", {
    routeTableId: "rtb-046ebd144d34ce5a7",
    subnetId: "subnet-0717b436cd86bdc60",
}, {
    protect: true,
});
const CdkStack_cf_exercise_PublicSubnet1_eipalloc_05c44fefc4b66689d = new aws.ec2.Eip("CdkStack/cf-exercise/PublicSubnet1-eipalloc-05c44fefc4b66689d", {
    domain: "vpc",
    networkBorderGroup: "us-east-1",
    networkInterface: "eni-081fa33a39f5a6fa3",
    publicIpv4Pool: "amazon",
    tags: {
        Name: "CdkStack/cf-exercise/PublicSubnet1",
    },
    // vpc: true,
}, {
    protect: true,
});


const import_sg_35693666 = new aws.ec2.SecurityGroup("import-sg-35693666", {
    description: "default VPC security group",
    egress: [{
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 0,
        protocol: "-1",
        toPort: 0,
    }],
    ingress: [{
        fromPort: 0,
        protocol: "-1",
        self: true,
        toPort: 0,
    }],
    name: "default",
    vpcId: "vpc-aef2a7d4",
}, {
    protect: true,
});
const import_sg_0780267a50f2845c8 = new aws.ec2.SecurityGroup("import-sg-0780267a50f2845c8", {
    description: "default VPC security group",
    name: "default",
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
const import_sg_0bd8e5e7db5b45d2a = new aws.ec2.SecurityGroup("import-sg-0bd8e5e7db5b45d2a", {
    description: "Allow inbound HTTP",
    egress: [{
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 0,
        protocol: "-1",
        toPort: 0,
    }],
    ingress: [{
        cidrBlocks: ["0.0.0.0/0"],
        description: "Allow inbound HTTP",
        fromPort: 80,
        protocol: "tcp",
        toPort: 80,
    }],
    name: "ec2-security-group-09a6ad9",
    vpcId: "vpc-0592b542a3d08a14b",
}, {
    protect: true,
});
