const express = require('express'); // importing express library for server creation and functions.
const cors = require('cors'); // importing cors library.

const app = express(); // creating express object - app.
app.use(cors()); // using cors to Allow or Enable all the Cross-Origin requests or endpoints.
app.use(express.json()); // to parse request body json data


// importing the orderCalculation function from calculate order file.
const order_calculate = require('./orderCalculate');


// defining the hostname and port number.
const hostname = 'localhost';
const port = 3001;




// app server default response for index.
app.get('/', (req, res) => {

    // sending the appropriate responses.
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Welcome to Order Calculation"));
});



// app server usage, routing and response structuring for Total Order Calculation.
app.get('/order-total', async (req, res) => {
    // calling the Total order Calculate method.
    let responseText = await order_calculate.Order_Total(req.body);


    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(responseText));
});




// app server starting and listening for requests.
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});