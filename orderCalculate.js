// method which verifies that all the order details are in the correct type-format.
function checkTypeFormat(order, error, successCheck) {

    if (!("distance" in order)) {
        successCheck = false;
        error += ` Delivery Distance value key or value is not provided!-----  `;
    } else {
        if ((typeof order.distance) == 'number') {
            if (order.distance < 0 || order.distance > 500000) {
                successCheck = false;
                error += ` distance value should be in the range of (0 - 500000) both inclusive.-----  `;
            }
        }
    }

    if ((typeof order.order_items[0].quantity) != 'number' ||
        (typeof order.order_items[0].price) != 'number' ||
        (typeof order.distance) != 'number'
    ) {
        successCheck = false;
        error += ` Some of the Inner Key's Values are not in the Correct Data-type and format-----  `;
    }


    if ('offer' in order) {
        if ((typeof order.offer.offer_type) != 'string' ||
            (typeof order.offer.offer_val) != 'number') {
            successCheck = false;
            error += ` Offer Values are not in the Correct Data-type and format----  `;
        }
    }

    // returning the original error and success varibles so that it can be used in the main function.
    return [error, successCheck];
}
// --------------------------------------------------------------------------------------------------------------------------





// method to calculate the delivery using - default Delivery-Distance Slab.
function calculateDelivery(distance) {

    // given delivery distance-cost slab.
    let delivery_cost_slab = [50, 100, 500, 1000];

    let delivery_cost = 0;

    // converting distance from metres to kilometres, because the cost is in the km base.
    distance = distance / 1000;


    if (distance >= 0 && distance <= 10) {
        delivery_cost = delivery_cost_slab[0];
    } else if (distance > 10 && distance <= 20) {
        delivery_cost = delivery_cost_slab[1];
    } else if (distance > 20 && distance <= 50) {
        delivery_cost = delivery_cost_slab[2];
    } else if(distance > 50 && distance <= 500) {
        delivery_cost = delivery_cost_slab[3];
    }


    // returning the final delivery cost in the Paisa format.
    // because the cost slab is the form of Rupees.
    return delivery_cost * 100;
}







// Total order Calculation Main method.
const OrderTotal = (order) => {

    // Promise will handle the returning elements very efficiently and with assurance using resolve and reject.
    return new Promise(async (resolve, reject) => {

        // base Variables init and definition to store respective Cost Values.
        let orderValue = 0;
        let itemTotal = 0;
        let deliveryFee = 0;
        let discountAmount = 0;
        let successCheck = true;
        let error = ``;


        // verifying whether all the internal Order items and keys are in the correct format and data type using Custom function.
        [error, successCheck] = await checkTypeFormat(order, error, successCheck);


        // iterate to the items list and multiply and add the every item price value with their quantities.
        for (const el of order.order_items) {
            itemTotal += el.price * el.quantity;
        }


        // calling delivery fee calculation method.
        deliveryFee = await calculateDelivery(order.distance);

        // adding the total items and delivery cost values.
        orderValue = itemTotal + deliveryFee;



        // checking if offer is availabe or not.
        if ("offer" in order) {

            // If it is available, check whether it is FLAT or DELIVERY and take it as discount amount.
            if (order.offer.offer_type === "FLAT") {
                discountAmount = order.offer.offer_val;
            } else if (order.offer.offer_type === "DELIVERY") {
                discountAmount = deliveryFee;
            } else {
                discountAmount = 0;
            }
        }


        // maximum discount should be order value.
        // If it exceeds the order value, reduce the discount Amount equals to the Order Value. (i.e Final Cost = 0)
        // If it is less than order value, reduce the discount Amount from the Order Value.
        // If there is no Offer, the  Order value will be as it is before.
        if (discountAmount > orderValue) {
            orderValue = 0;
        } else {
            orderValue = orderValue - discountAmount;
        }


        // Returning the final calculated 'OrderValue' Cost in the JSON format.
        if (successCheck) {
            resolve({ 'order_total': orderValue });
        } else {
            reject(error);
        }
    });
};


// exporting the Order Total function, so that it can be accessed in the other files.
exports.Order_Total = OrderTotal;