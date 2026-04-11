import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, HelpCircle } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { type UoMGroupDto } from '../../types/uomgroup-dto';
import { uomGroupSchema } from '../../types/uomgroup.schema';
import { DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UoMGroupFormProps {
  initial: UoMGroupDto;
  mode: 'add' | 'edit';
  isLoading?: boolean;
  onSave: (data: UoMGroupDto) => Promise<void>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UoMGroupForm({
  initial,
  mode,
  isLoading,
  onSave,
  onSuccess,
  onCancel,
}: UoMGroupFormProps) {
  const [form, setForm] = useState<UoMGroupDto>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loading = isLoading || isSubmitting;
  const isAdd = mode === 'add';

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function validate() {
    try {
      uomGroupSchema.parse(form);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formatted: Record<string, string> = {};
        err.issues.forEach((e) => {
          const path = e.path.join('.');
          formatted[path] = e.message;
        });
        setErrors(formatted);
      }
      return false;
    }
  }

  async function handleSave() {
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading(isAdd ? 'Creating UoM group...' : 'Updating UoM group...');

    try {
      await onSave(form);
      toast.success(isAdd ? 'UoM group created' : 'UoM group updated', { id: toastId });
      onSuccess();
    } catch {
      toast.error(isAdd ? 'Failed to create' : 'Failed to update', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  const addLine = () => {
    setForm({
      ...form,
      uoMGroupLines: [...form.uoMGroupLines, { uoM: '', baseQty: 1 }],
    });
  };

  const removeLine = (index: number) => {
    setForm({
      ...form,
      uoMGroupLines: form.uoMGroupLines.filter((_, i) => i !== index),
    });
  };

  const updateLine = (index: number, field: 'uoM' | 'baseQty', value: string | number) => {
    const newLines = [...form.uoMGroupLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setForm({ ...form, uoMGroupLines: newLines });

    // Clear error for this field if it exists
    const errorKey = `uoMGroupLines.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  return (
    <>
      <DialogTitle>{isAdd ? 'Add UoM Group' : 'Edit UoM Group'}</DialogTitle>
      <DialogDescription>
        {isAdd
          ? 'Define a new group of units and their conversion factors.'
          : 'Update conversion factors for this UoM group.'}
      </DialogDescription>

      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid gap-2">
          <Label>Base Unit of Measurement</Label>
          <Input
            disabled={loading}
            value={form.baseUoM}
            onChange={(e) => {
              setForm({ ...form, baseUoM: e.target.value });
              if (errors.baseUoM) setErrors((prev) => ({ ...prev, baseUoM: '' }));
            }}
            placeholder="e.g. piece"
            className={errors.baseUoM ? 'border-destructive' : ''}
          />
          {errors.baseUoM && <p className="text-xs text-destructive">{errors.baseUoM}</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Conversion Lines</Label>
              <TooltipProvider delay={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      A conversion line is meant to be compared against the base unit of measure.
                      For example, you can have a conversion line for a box which contains 20 base
                      unit of measure pieces
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={addLine}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Line
            </Button>
          </div>

          <div className="space-y-3">
            {form.uoMGroupLines.map((line, index) => (
              <div
                key={index}
                className="flex gap-2 items-start border p-3 rounded-md relative group bg-muted/20"
              >
                <div className="flex-1 space-y-2">
                  <Label className="text-xs font-semibold">UoM Name</Label>
                  <Input
                    disabled={loading}
                    value={line.uoM}
                    onChange={(e) => updateLine(index, 'uoM', e.target.value)}
                    placeholder="e.g. Box"
                    className={errors[`uoMGroupLines.${index}.uoM`] ? 'border-destructive' : ''}
                  />
                  {errors[`uoMGroupLines.${index}.uoM`] && (
                    <p className="text-xs text-destructive">
                      {errors[`uoMGroupLines.${index}.uoM`]}
                    </p>
                  )}
                </div>
                <div className="w-24 space-y-2">
                  <Label className="text-xs font-semibold">Base Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    disabled={loading}
                    value={line.baseQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateLine(index, 'baseQty', val < 1 ? 1 : val);
                    }}
                    className={errors[`uoMGroupLines.${index}.baseQty`] ? 'border-destructive' : ''}
                  />
                  {errors[`uoMGroupLines.${index}.baseQty`] && (
                    <p className="text-xs text-destructive">
                      {errors[`uoMGroupLines.${index}.baseQty`]}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeLine(index)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {errors.uoMGroupLines && (
            <p className="text-xs text-destructive">{errors.uoMGroupLines}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
