const DATA = [{
    customerID: 1,
    orderItems: [{
        orderID: 1,
        orderDescription: 'New shoes',
        quantity: 2
    },{
        orderID: 2,
        orderDescription: 'T Shirt',
        quantity: 10
    }]
}]

const PROTO_PATH = 'definitions.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
});
var hello_proto = grpc.loadPackageDefinition(packageDefinition).OnlineShop;

function GetOrdersForCustomerID(call, callback) {
    const query = DATA.filter(el => el.customerID === call.request.id)
    callback(null, query[0]);
}

function main() {
    var server = new grpc.Server();
    server.addService(hello_proto.OrdersService.service, {GetOrdersForCustomerID: GetOrdersForCustomerID});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
      server.start();
    });
}
  
main();
