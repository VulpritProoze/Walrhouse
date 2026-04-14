namespace Walrhouse.Domain.Entities;

public partial class SalesOrder
{
    /// <summary>
    /// Closes the sales order. Requires the ID of the user performing the action.
    /// Once closed, the order state is terminal and cannot be changed.
    /// </summary>
    /// <param name="userId">The identifier of the user closing the order.</param>
    public void Close(string userId)
    {
        if (Status != SalesOrderStatus.Open)
        {
            throw new DomainException($"Cannot close a sales order that is already {Status}.");
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User ID is required to close the order.", nameof(userId));
        }

        Status = SalesOrderStatus.Closed;
        ClosedBy = userId;
    }

    /// <summary>
    /// Cancels the sales order.
    /// Once cancelled, the order state is terminal and cannot be changed.
    /// </summary>
    public void Cancel()
    {
        if (Status != SalesOrderStatus.Open)
        {
            throw new DomainException($"Cannot cancel a sales order that is already {Status}.");
        }

        Status = SalesOrderStatus.Cancelled;
    }
}
