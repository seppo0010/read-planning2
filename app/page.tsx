"use client"
import useSWR from 'swr'
import * as dfd from "danfojs"
import { useEffect, useState } from 'react';
import mockPending from './mock-pending'
import mockDow from './mock-dow'

const apiKey = `AIzaSyA6LYbb-Xlq0lkeCLMb88sSWFVE9beq1Z0`
const spreadsheetId = '1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM';
const sheetNamePending = 'Pending';
const sheetNameDow = 'Reading time';

const DUE_DATE = 'Due date'
const LENGTH = 'Length'
const DONE_AT = 'Done at'
const TODAY = new Date() // new Date(2024, 6, 15);
const TO_READ = 'Para leer'
const ALREADY_READ = 'Leído'
const DATE = 'date'

const fetcher = process.env.NODE_ENV === 'development' ? async (_: string) => {
  return mockPending
} : (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  // https://docs.google.com/spreadsheets/d/1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM/edit?gid=0#gid=0
  const { data, error } = useSWR(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURI(spreadsheetId)}/values/${encodeURI(sheetNamePending)}?key=${encodeURIComponent(apiKey)}`,
    fetcher
  )

  const { data: dataDow, error: errorDow } = useSWR(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURI(spreadsheetId)}/values/${encodeURI(sheetNameDow)}?key=${encodeURIComponent(apiKey)}`,
    fetcher
  )
  const [due, setDue] = useState<dfd.DataFrame | null>(null);
  const [done, setDone] = useState<dfd.DataFrame | null>(null);

  useEffect(() => {
    if (!data) return;
    const rows = data.values;
    const df = new dfd.DataFrame(rows.slice(1).map((row: any[]) => row.slice(0, 5)), { columns: rows[0].slice(0, 5) }).asType(LENGTH, "int32");

    setDue(df
      .loc({ columns: [DUE_DATE, LENGTH] })
      .groupby([DUE_DATE]).sum()
      .rename({ [LENGTH + '_sum']: TO_READ, [DUE_DATE]: DATE })
      .dropNa())
    setDone(df
      .loc({ columns: [DONE_AT, LENGTH] })
      .groupby([DONE_AT]).sum()
      .rename({ [LENGTH + '_sum']: ALREADY_READ, [DONE_AT]: DATE })
      .dropNa())
  }, [data, error])

  useEffect(() => {
    if (!due || !done) return;
    due.print();
    done.print();
    const config = {
      columns: [TO_READ, ALREADY_READ],
    };
    const layout = {
      title: "Progreso",
      xaxis: {
        title: "Fecha",
      },
      yaxis: {
        title: "Páginas",
      },
    };
    const new_df = (dfd.concat({ dfList: [due, done], axis: 0 }).sortValues(DATE).fillNa(0) as dfd.DataFrame)
      .setIndex({ column: DATE, drop: true })
      .cumSum({ axis: 0 });
    const isFuture = new dfd.Series(new_df.index.map((x) => new Date(x) > TODAY), { columns: ['isFuture'] });

    const readStatus = (dfd.concat({ dfList: [new_df, isFuture, new dfd.Series(new_df.index, { columns: [DATE] })], axis: 1 }) as dfd.DataFrame)
      .setIndex({ column: DATE, drop: true })
      .apply(([x1, x2, isFuture]: [number, number, boolean]) => (isFuture ? [x1, null, isFuture] : [x1, x2, isFuture]));
    readStatus.plot("plot_div").line({ config, layout })

  }, [due, done])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {(error || errorDow) && <div>Failed to load</div>}
      {(!data || !dataDow) && <div>Loading</div>}
      <div id="plot_div"></div>
    </main>
  );
}
