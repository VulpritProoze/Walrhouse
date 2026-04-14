using System.Text.Json;

namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a sales order needed to be fulfilled.
/// </summary>
public partial class SalesOrder : BaseAuditableEntity
{
    private static readonly JsonSerializerOptions _uomJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    /// <summary>
    /// This is a helper method to normalize the ExpiryDate to UTC midnight.
    /// This is to ensure that we are only comparing the date part of the ExpiryDate
    /// when we are checking for expired batches, and not the time part.
    /// </summary>
    /// <param name="date"></param>
    /// <returns></returns>
    private static DateTimeOffset NormalizeToUtcMidnight(DateTimeOffset date)
    {
        return new DateTimeOffset(date.UtcDateTime.Date, TimeSpan.Zero);
    }

    public string? OrderLinesJson
    {
        get => JsonSerializer.Serialize(OrderLines, _uomJsonOptions);
        private set =>
            OrderLines = string.IsNullOrEmpty(value)
                ? new List<OrderLine>()
                : JsonSerializer.Deserialize<List<OrderLine>>(value, _uomJsonOptions)
                    ?? new List<OrderLine>();
    }

    private DateTimeOffset _dueDate;

    /// <summary>
    /// This represents the due date of the sales order, measured in UTC.
    /// </summary>
    public DateTimeOffset? DueDate
    {
        get => _dueDate;
        set => _dueDate = value.HasValue ? NormalizeToUtcMidnight(value.Value) : default;
    }

    /// <summary>
    /// This represents the status of the sales order.
    /// Setter is private to enforce domain transitions via methods.
    /// </summary>
    public SalesOrderStatus Status { get; private set; } = SalesOrderStatus.Open;

    /// <summary>
    /// This represents the identifier of the user who closed the order, if applicable.
    /// Setter is private to ensure it's only set during the Close operation.
    /// </summary>
    public string? ClosedBy { get; private set; }

    /// <summary>
    /// This represents the CustomerName of the customer who placed the order.
    /// </summary>
    public string? CustomerName { get; set; }

    /// <summary>
    /// This represents any remarks or notes about the sales order.
    /// </summary>
    public string? Remarks { get; set; }

    /// <summary>
    /// Gets or sets a collection of UoMGroupLines.
    /// If, for example, we define an item to be measured in many measurements,
    /// say piece, or box, or bottle, we put those measurements here and their
    /// conversion factor (baseQty) against the BaseUoM (always 1 in baseQty).
    /// </summary>
    public required ICollection<OrderLine> OrderLines { get; set; } = new List<OrderLine>();
}

/// <summary>
/// Represents a line of SalesOrder.
/// This is where we define the batches of an order line.
/// </summary>
public class OrderLine
{
    /// <summary>
    /// Gets or sets the DocEntry of the order line.
    /// </summary>
    public string DocEntry { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Gets or sets a collection of batch IDs for the order line.
    /// This correlates to BatchNumber in the Batch entity.
    /// </summary>
    public required ICollection<string> BatchNumbers { get; set; }
}
