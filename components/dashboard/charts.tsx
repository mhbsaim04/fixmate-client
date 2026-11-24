"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
      <h2 className="text-base font-bold tracking-tight sm:text-lg">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5 min-w-0">{children}</div>
    </section>
  );
}

function ChartEmpty() {
  return <div className="grid h-48 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-muted-foreground">Nothing to chart yet</div>;
}

export function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const visible = data.filter((d) => d.value > 0);
  const total = visible.reduce((s, d) => s + d.value, 0);
  if (!total) return <ChartEmpty />;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative size-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={visible} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3} stroke="none">
              {visible.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-3xl font-extrabold leading-none">{total}</p>
            <p className="text-xs text-muted-foreground">total</p>
          </div>
        </div>
      </div>
      <ul className="grid flex-1 gap-2.5 text-sm">
        {visible.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2.5">
              <span className="size-3 rounded-full" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="font-bold">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendChart({
  data,
  color = "hsl(var(--primary))",
  prefix = "",
}: {
  data: { label: string; value: number }[];
  color?: string;
  prefix?: string;
}) {
  if (!data.some((d) => d.value > 0)) return <ChartEmpty />;
  return (
    <div className="h-56 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -16, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
          <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            contentStyle={tooltipStyle}
            formatter={(v) => [`${prefix}${Number(v).toLocaleString("en-US")}`, ""]}
            labelStyle={{ fontWeight: 700 }}
          />
          <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
