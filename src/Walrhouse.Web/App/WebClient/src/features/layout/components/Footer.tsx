export default function Footer() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground/80 tracking-tight">Majesty Pharma</span>
          <span className="hidden sm:inline-block h-3 w-px bg-border/40 mx-2" />
          <p className="text-muted-foreground/60 italic text-xs">
            Quality Medicines. Accessible to All.
          </p>
        </div>

        <div className="flex items-center gap-6 font-medium text-xs uppercase tracking-wider">
          <a href="#" className="hover:text-primary transition-colors">
            Docs
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Support
          </a>
          <p className="font-normal text-muted-foreground/40 normal-case tracking-normal">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
