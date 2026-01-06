using System;
using API.DTOs;
using API.Extensions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(ICartService cartService, IUnitOfWork unit) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO orderDTO)
    {
        var email = User.GetEmail();

        var cart = await cartService.GetCartAsync(orderDTO.CartId);

        if (cart == null) return BadRequest("Cart not found");

        if (cart.PaymentIntentId == null)
            return BadRequest("no payment intent for this order");

        var items = new List<OrderItem>();

        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Product>().GetByIdAsync(item.ProductId);

            if (productItem == null)
                return BadRequest("Problem with the order");

            var itemOrdered = new ProductItemOrdered
            {
                ProductId = productItem.Id,
                ProductName = productItem.Name,
                PictureUrl = productItem.PictureUrl
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity
            };
            items.Add(orderItem);
        }
        var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync(orderDTO.DeliveryMethodId);

        if (deliveryMethod == null)
            return BadRequest("no delivery method selected");

        var order = new Order
        {
            BuyerEmail = email,
            OrderItems = items,
            ShippingAddress = orderDTO.ShippingAddress,
            DeliveryMethod = deliveryMethod,
            Subtotal = items.Sum(item => item.Price * item.Quantity),
            PaymentIntentId = cart.PaymentIntentId,
            PaymentSummary = orderDTO.PaymentSummary
        };

        unit.Repository<Order>().Add(order);

        if (await unit.Complete())
            return order;

        return BadRequest("Problem creating order");

    }//the way this system works is that we r gonna create the order after the payment is successful

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDTO>>> GetOrdersForUser()
    {
        var spec = new OrderSpecification(User.GetEmail());

        var orders = await unit.Repository<Order>().ListAsync(spec);

        var ordersToReturn = orders.Select(order => order.ToDTO()).ToList();

        return Ok(ordersToReturn);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDTO>> GetOrderById(int id)
    {
        var spec = new OrderSpecification(User.GetEmail(), id);

        var order = await unit.Repository<Order>().GetEntityWithSpec(spec);

        if (order == null) return NotFound();

        return order.ToDTO();
    }
}
