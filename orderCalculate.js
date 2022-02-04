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
const Order_Total = async(order) => {

        // base Variables init and definition to store respective Cost Values.
        let orderValue = 0;
        let itemTotal = 0;
        let deliveryFee = 0;
        let discountAmount = 0;


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

        return { 'order_total': orderValue }
};


// exporting the Order Total function, so that it can be accessed in the other files.
exports.Order_Total = Order_Total;