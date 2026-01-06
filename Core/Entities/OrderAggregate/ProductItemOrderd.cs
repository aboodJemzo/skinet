using System;

namespace Core.Entities.OrderAggregate;

public class ProductItemOrdered // this class is gonna be owned by the orderitem class / table  and the props r gonna be in the same table as the orderitem
{
    public int ProductId { get; set; }
    public required string ProductName { get; set; }
    public required string PictureUrl { get; set; }
}
