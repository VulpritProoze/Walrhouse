using SkiaSharp;
using Walrhouse.Application.Common.Interfaces;
using ZXing.SkiaSharp;
using DomainBarcodeFormat = Walrhouse.Domain.Enums.BarcodeFormat;
using ZXingBarcodeFormat = ZXing.BarcodeFormat;

namespace Walrhouse.Infrastructure.Services;

public class BarcodeService : IBarcodeService
{
    public byte[] Encode(
        string content,
        DomainBarcodeFormat format,
        int width = 300,
        int height = 300
    )
    {
        var writer = new BarcodeWriter
        {
            Format = MapBarcodeFormat(format),
            Options = new ZXing.Common.EncodingOptions
            {
                Height = height,
                Width = width,
                Margin = 1,
                PureBarcode = false,
            },
        };

        using var bitmap = writer.Write(content);
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);

        return data.ToArray();
    }

    public string? Decode(byte[] barcodeBytes)
    {
        using var stream = new MemoryStream(barcodeBytes);
        using var bitmap = SKBitmap.Decode(stream);

        if (bitmap == null)
            return null;

        var reader = new BarcodeReader();
        var result = reader.Decode(bitmap);

        return result?.Text;
    }

    private static ZXingBarcodeFormat MapBarcodeFormat(DomainBarcodeFormat format)
    {
        return format switch
        {
            DomainBarcodeFormat.GS1DataMatrix => ZXingBarcodeFormat.DATA_MATRIX,
            DomainBarcodeFormat.GS1_128 => ZXingBarcodeFormat.CODE_128,
            DomainBarcodeFormat.QRCode => ZXingBarcodeFormat.QR_CODE,
            DomainBarcodeFormat.Code39 => ZXingBarcodeFormat.CODE_39,
            _ => throw new ArgumentOutOfRangeException(nameof(format), format, null),
        };
    }
}
