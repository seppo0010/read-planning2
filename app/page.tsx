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
const READ_AT = 'Read at'
const CARDED_AT = 'Carded at'
const TODAY = process.env.NODE_ENV === 'development' ? new Date(2024, 6, 15) : new Date();
const TO_READ = 'Para leer'
const ALREADY_READ = 'Leído'
const ALREADY_CARDED = 'Tarjeteado'
const DATE = 'date'
const SUBJECT = 'Subject'

interface Text {
  Name: string;
  Length: number;
  [DUE_DATE]: string;
  Subject: string;
  [READ_AT]: string;
  [CARDED_AT]: string;
}

const fetcher = process.env.NODE_ENV === 'development' ? async (_: string) => {
  return mockPending
} : (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  // https://docs.google.com/spreadsheets/d/1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM/edit?gid=0#gid=0
  const { data, error } = useSWR(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURI(spreadsheetId)}/values/${encodeURI(sheetNamePending)}?key=${encodeURIComponent(apiKey)}`,
    fetcher
  )

  const [due, setDue] = useState<dfd.DataFrame | null>(null);
  const [read, setRead] = useState<dfd.DataFrame | null>(null);
  const [cardedAt, setCardedAt] = useState<dfd.DataFrame | null>(null);
  const [pending, setPending] = useState<dfd.DataFrame | null>(null);
  const [nextWeek, setNextWeek] = useState<Text[] | null>(null);
  const [subjects, setSubjects] = useState<string[] | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [df, setDf] = useState<dfd.DataFrame | null>(null);
  const [allDf, setAllDf] = useState<dfd.DataFrame | null>(null);

  useEffect(() => {
    if (!data || !data.values || allDf) return;
    const values = data.values;
    const df = new dfd.DataFrame(values.slice(1).map((row: any[]) => row.concat(['', '', '', '', '', '']).slice(0, 6)), {
      columns: values[0].slice(0, 6),
      config: {
        tableMaxColInConsole: 7,
        tableMaxRow: 10
      }
    }).asType(LENGTH, "int32");
    setSubjects((dfd.toJSON(df.column(SUBJECT).unique()) as [string[]])[0] as string[])
    setAllDf(df);
  }, [data, allDf, selectedSubject]);

  useEffect(() => {
    if (!allDf) return;
    setDf(selectedSubject === null ? allDf : allDf.query(allDf.column(SUBJECT).apply((v) => v === selectedSubject)))
  }, [allDf, selectedSubject]);

  useEffect(() => {
    if (!df) return;
    setPending(df)
    setDue(df
      .loc({ columns: [DUE_DATE, LENGTH] })
      .groupby([DUE_DATE]).sum()
      .rename({ [LENGTH + '_sum']: TO_READ, [DUE_DATE]: DATE })
      .dropNa())
    setRead(df
      .loc({ columns: [READ_AT, LENGTH] })
      .groupby([READ_AT]).sum()
      .rename({ [LENGTH + '_sum']: ALREADY_READ, [READ_AT]: DATE })
      .dropNa())
    setCardedAt(df
      .loc({ columns: [CARDED_AT, LENGTH] })
      .groupby([CARDED_AT]).sum()
      .rename({ [LENGTH + '_sum']: ALREADY_CARDED, [CARDED_AT]: DATE })
      .dropNa())
  }, [df, error])

  useEffect(() => {
    if (!due || !read || !cardedAt) return;
    const config = {
      columns: [TO_READ, ALREADY_READ, ALREADY_CARDED],
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
    const new_df = (dfd.concat({ dfList: [due, read, cardedAt], axis: 0 }).sortValues(DATE).fillNa(0) as dfd.DataFrame)
      .groupby([DATE]).max().rename({ [`${TO_READ}_max`]: TO_READ, [`${ALREADY_READ}_max`]: ALREADY_READ, [`${ALREADY_CARDED}_max`]: ALREADY_CARDED })
      .setIndex({ column: DATE, drop: true })
      .cumSum({ axis: 0 });
    const isFuture = new dfd.Series(new_df.index.map((x) => new Date(x) > TODAY), { columns: ['isFuture'] });

    const readStatus = (dfd.concat({ dfList: [new_df, isFuture, new dfd.Series(new_df.index, { columns: [DATE] })], axis: 1 }) as dfd.DataFrame)
      .setIndex({ column: DATE, drop: true })
      .apply(([x1, x2, x3, isFuture]: [number, number, number, boolean]) => (isFuture ? [x1, null, null, isFuture] : [x1, x2, x3, isFuture]));
    readStatus.plot("plot_div").line({ config, layout })

  }, [due, read])

  useEffect(() => {
    if (!pending) return;
    const df = pending;
    setNextWeek(dfd.toJSON(df.query(df[READ_AT].isNa().and(df[DUE_DATE].apply((d: Date) => new Date(d).getTime()).lt(TODAY.getTime() + 7 * 24 * 60 * 60 * 1000)))) as Text[]);
  }, [pending])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Lectura</h1>
      {subjects !== null && <div>
        <select value={selectedSubject ?? ''} onChange={(e) => setSelectedSubject(e.target.value !== '' ? e.target.value : null)}>
          <option value={''}>Todas las materias</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>}
      {(error) && <div>Failed to load</div>}
      {(!data) && <div>Loading</div>}
      <div id="plot_div"></div>
      {nextWeek && <div>
        <h2>Próximos textos</h2>
        <div>
          <table className="border-collapse border border-slate-400">
            <thead>
              <tr>
                <th className="border border-slate-300 text-left">Nombre</th>
                <th className="border border-slate-300 text-left">Longitud</th>
              </tr>
            </thead>
            <tbody>
              {nextWeek.map((text) => (
                <tr key={text.Name}>
                  <td className="border border-slate-300">{text.Name}</td>
                  <td className="border border-slate-300">{text.Length} páginas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </main>
  );
}
