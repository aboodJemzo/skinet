using System;

namespace Core.Entities.OrderAggregate;

public class ShippingAddress // this class is gonna be owned by the order table and each prop is gonna be in the same table as the order
{
    public required string Name { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
}
