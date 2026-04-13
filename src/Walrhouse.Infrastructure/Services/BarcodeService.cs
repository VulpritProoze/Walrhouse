using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Walrhouse.Application.Common.Interfaces;
using ZXing;
using ZXing.Common;
using DomainBarcodeFormat = Walrhouse.Domain.Enums.BarcodeFormat;
using ZXingBarcodeFormat = ZXing.BarcodeFormat;
using ZXingBarcodeReader = ZXing.BarcodeReader<SixLabors.ImageSharp.Image>;
using ZXingBarcodeWriter = ZXing.ImageSharp.BarcodeWriter<SixLabors.ImageSharp.PixelFormats.Rgba32>;
using ZXingImageSharpLuminanceSource = ZXing.ImageSharp.ImageSharpLuminanceSource<SixLabors.ImageSharp.PixelFormats.Rgba32>;

namespace Walrhouse.Infrastructure.Services;

public class BarcodeService : IBarcodeService
{
    public byte[] Encode(
        string content,
        DomainBarcodeFormat format,
        int width = 300,
        int height = 200
    )
    {
        var writer = new ZXingBarcodeWriter
        {
            Format = MapBarcodeFormat(format),
            Options = new EncodingOptions
            {
                Height = height,
                Width = width,
                Margin = 1,
                PureBarcode = false,
            },
        };

        using var image = writer.Write(content);
        using var stream = new MemoryStream();
        image.SaveAsPng(stream);

        return stream.ToArray();
    }

    public string? Decode(byte[] barcodeBytes)
    {
        using var stream = new MemoryStream(barcodeBytes);
        using var image = Image.Load<Rgba32>(stream);

        var luminanceSource = new ZXingImageSharpLuminanceSource(image);

        var reader = new ZXingBarcodeReader(null, null, ls => new GlobalHistogramBinarizer(ls))
        {
            Options = new DecodingOptions { TryHarder = true },
        };

        var result = reader.Decode(luminanceSource);

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
