using System;
using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification : BaseSpecification<Order>
{
    public OrderSpecification(string email) : base(o => o.BuyerEmail == email)
    {
        AddInclude(o => o.OrderItems);
        AddInclude(o => o.DeliveryMethod);
        AddOrderByDescending(o => o.OrderDate);
    }

    public OrderSpecification(string email, int id) : base(o => o.BuyerEmail == email && o.Id == id)// this way we ensure that the user can only access their own orders
    {
        // we could use the same includes as above but to demonstrate the string based includes for thenInclude we will do it this way
        AddInclude("OrderItems");// if we have a thenInclude we use a period and then whatever the related entity is(if we want to include more than one level)
        AddInclude("DeliveryMethod");
    }
}
