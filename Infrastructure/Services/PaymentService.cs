using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, ICartService cartService,
IUnitOfWork unit) : IPaymentService // we replaced IGenericRepository<Product> productRepo and IGenericRepository<DeliveryMethod> dmRepo with IUnitOfWork unit
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"]; // we got the StripeConfiguration from the strip package that we installed

        var cart = await cartService.GetCartAsync(cartId);

        if (cart == null) return null;

        var shippingPrice = 0m; // 0m represent the decimal

        if (cart.DeliveryMethodId.HasValue) // cuz we made it optional we have the access to the HasValue method
        {
            var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);

            if (deliveryMethod == null) return null;

            shippingPrice = deliveryMethod.Price;
        }

        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);

            if (productItem == null) return null;

            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var service = new PaymentIntentService(); // we got PaymentIntentService from the stripe package
        PaymentIntent? intent = null;

        // now we need to check if we have already got a payment intent ID in our shopping cart
        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)(shippingPrice * 100), // we multiply by 100 cuz stripe works with the smallest currency unit
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };
            intent = await service.CreateAsync(options);
            //we r gonna update our cart at this point cuz we need to store the payment intent ID and the client secret that we get back after we have created the payment intent
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;// the client secret is gonna be used by the client to directly interact with stripe to confirm the payment
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)cart.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)(shippingPrice * 100)
            };
            intent = await service.UpdateAsync(cart.PaymentIntentId, options);
        }
        await cartService.SetCartAsync(cart);

        return cart;
    }
}
