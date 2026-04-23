using System;
using System.Collections.Generic;
using Walrhouse.ExternalSeeder.Data;

namespace Walrhouse.ExternalSeeder.Helpers;

internal static class ConsoleMenu
{
    public static void RenderMenu(IReadOnlyList<SeederOption> seeders, int selectedIndex)
    {
        Console.Clear();
        Console.WriteLine("--- Walrhouse External Seeder (.NET 10) ---");
        Console.WriteLine("Use Up/Down arrows and press Enter to select.\n");

        for (var i = 0; i < seeders.Count; i++)
        {
            WriteMenuLine(i, selectedIndex, $"Run {seeders[i].Name}");
        }

        WriteMenuLine(seeders.Count, selectedIndex, "Run All");
        WriteMenuLine(seeders.Count + 1, selectedIndex, "Exit");
    }

    private static void WriteMenuLine(int lineIndex, int selectedIndex, string text)
    {
        if (lineIndex == selectedIndex)
        {
            Console.ForegroundColor = ConsoleColor.Black;
            Console.BackgroundColor = ConsoleColor.Gray;
            Console.WriteLine($"> {text}");
            Console.ResetColor();
            return;
        }

        Console.WriteLine($"  {text}");
    }
}
