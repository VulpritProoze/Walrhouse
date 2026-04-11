using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Common.Interfaces;

public interface IBarcodeService
{
    byte[] Encode(string content, BarcodeFormat format, int width = 300, int height = 300);
    string? Decode(byte[] barcodeBytes);
}
