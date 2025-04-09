exports.processPayment = async (paymentDetails) => {
    try {
        return {
            success: true,
            transactionId: "TXN" + Math.floor(Math.random() * 1000000),
        };
    } catch (error) {
        return { success: false, error: "Payment processing failed" };
    }
};
