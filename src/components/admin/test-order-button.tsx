"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FlaskConical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PLANS } from "@/lib/plans";

export function TestOrderButton() {
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useState<string>("essentials");
  const [count, setCount] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    startTransition(async () => {
      const res = await fetch("/api/admin/test-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId, count }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to create test order");
        return;
      }
      toast.success(`Created ${json.created.length} test order${json.created.length > 1 ? "s" : ""}`);
      setOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await fetch("/api/admin/test-order", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to clean up test orders");
        return;
      }
      toast.success(`Removed ${json.removed} test customers`);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FlaskConical className="h-4 w-4" />
          Simulate test order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulate a paid order end-to-end</DialogTitle>
          <DialogDescription>
            Generates a fake user, customer profile, subscription, order and invoice. Fully removable
            with one click. Lives at <code className="text-xs">test+timestamp@arohacalls.test</code>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — NZ${p.priceNZD}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="count">How many?</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
            />
            <p className="mt-2 text-xs text-muted-foreground">Up to 10 at a time. Useful for stress-testing dashboards.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDelete} disabled={isPending}>
            <Trash2 className="h-4 w-4" />
            Remove all test data
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
