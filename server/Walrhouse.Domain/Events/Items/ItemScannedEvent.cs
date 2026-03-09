namespace Walrhouse.Domain.Events.Items;

/// <summary>
/// Domain event raised when an item is scanned in the warehouse.
/// </summary>
public class ItemScannedEvent : BaseEvent
{
    public ItemScannedEvent(Item item)
    {
        Item = item;
    }

    public Item Item { get; }
}
