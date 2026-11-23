import { formatCurrency, formatDate } from "./utils";
import type { Booking, Payment } from "./types";

/** Builds and downloads a PDF invoice in the browser (jsPDF is loaded on demand). */
export async function downloadInvoice(booking: Booking, payment?: Payment) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const left = 48;
  let y = 0;

  // Hazard-tape header
  doc.setFillColor(16, 21, 31);
  doc.rect(0, 0, W, 96, "F");
  doc.setFillColor(255, 214, 10);
  doc.rect(0, 96, W, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("FixMate", left, 58);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Invoice / Payment receipt", left, 78);
  doc.text(`#${booking._id.slice(-8).toUpperCase()}`, W - left, 58, { align: "right" });
  doc.text(formatDate(payment?.paidAt ?? new Date()), W - left, 78, { align: "right" });

  doc.setTextColor(16, 21, 31);
  y = 150;
  const block = (title: string, lines: string[], x: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(110, 118, 135);
    doc.text(title, x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(16, 21, 31);
    lines.forEach((l, i) => doc.text(l, x, y + 18 + i * 16));
  };
  block("BILLED TO", [booking.customerName, booking.customerEmail, booking.customerPhone], left);
  block("TECHNICIAN", [booking.technicianName, booking.technicianEmail], W / 2 + 10);

  y = 250;
  doc.setDrawColor(220, 224, 232);
  doc.line(left, y, W - left, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(110, 118, 135);
  doc.text("SERVICE", left, y + 20);
  doc.text("CATEGORY", W / 2, y + 20);
  doc.text("AMOUNT", W - left, y + 20, { align: "right" });
  doc.line(left, y + 30, W - left, y + 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(16, 21, 31);
  doc.text(doc.splitTextToSize(booking.serviceTitle, W / 2 - left - 20), left, y + 54);
  doc.text(booking.category, W / 2, y + 54);
  const amount = payment?.amount ?? booking.finalAmount;
  doc.text(formatCurrency(amount), W - left, y + 54, { align: "right" });

  doc.line(left, y + 80, W - left, y + 80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total paid", W / 2, y + 108);
  doc.text(formatCurrency(amount), W - left, y + 108, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 118, 135);
  doc.text(`Transaction ID: ${payment?.transactionId ?? "—"}`, left, y + 150);
  doc.text(`Service date: ${formatDate(booking.preferredDate)}`, left, y + 166);
  doc.text("Thank you for using FixMate. Paid securely with Stripe.", left, y + 200);

  doc.save(`FixMate-invoice-${booking._id.slice(-8)}.pdf`);
}
