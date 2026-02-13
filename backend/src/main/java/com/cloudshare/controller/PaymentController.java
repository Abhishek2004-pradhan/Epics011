package com.cloudshare.controller;

import com.cloudshare.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<Object> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = Integer.parseInt(data.get("amount").toString());
            String orderJson = paymentService.createOrder(amount);
            // Convert JSON string to Map so Spring Boot sends it as application/json
            return ResponseEntity.ok(new org.json.JSONObject(orderJson).toMap());
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            boolean isValid = paymentService.verifyPayment(
                    data.get("razorpay_order_id"),
                    data.get("razorpay_payment_id"),
                    data.get("razorpay_signature"));
            return ResponseEntity.ok(isValid);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(false);
        }
    }
}
