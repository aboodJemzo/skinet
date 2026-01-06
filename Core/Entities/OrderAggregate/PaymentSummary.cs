using System;

namespace Core.Entities.OrderAggregate;

public class PaymentSummary // this class is gonna be owned by the order class / table  and the props r gonna be in the same table as the order
{
    public int Last4 { get; set; }
    public required string Brand { get; set; }
    public int ExpMonth { get; set; }
    public int ExpYear { get; set; }
}
