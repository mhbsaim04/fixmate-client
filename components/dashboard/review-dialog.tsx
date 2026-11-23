"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StarPicker } from "@/components/ui/rating";
import { Textarea } from "@/components/ui/input";

export function ReviewDialog({
  booking,
  onClose,
  onDone,
}: {
  booking: Booking | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!booking) return;
    if (!rating) return toast.error("Pick a star rating first");
    setLoading(true);
    try {
      await api.post(`/api/bookings/${booking._id}/review`, { rating, review: review.trim() });
      toast.success("Thanks for your review!");
      setRating(0);
      setReview("");
      onDone();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this repair</DialogTitle>
          <DialogDescription>{booking?.serviceTitle} by {booking?.technicianName}</DialogDescription>
        </DialogHeader>
        <StarPicker value={rating} onChange={setRating} />
        <Textarea className="mt-4" maxLength={300} placeholder="Share a few words about the work (optional)" value={review} onChange={(e) => setReview(e.target.value)} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Not now</Button>
          <Button onClick={submit} loading={loading}>Submit review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
