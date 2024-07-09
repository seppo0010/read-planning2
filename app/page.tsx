"use client"
import { useState } from "react";
import * as dfd from "danfojs"

const apiKey = `AIzaSyA6LYbb-Xlq0lkeCLMb88sSWFVE9beq1Z0`
const spreadsheetId = '1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM';
const sheetName = 'Sheet1';

const DUE_DATE = 'Due date'
const LENGTH = 'Length'
const DONE_AT = 'Done at'
const TODAY = new Date() // new Date(2024, 6, 15);

export default function Home() {
  useState(async () => {
    // https://docs.google.com/spreadsheets/d/1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM/edit?gid=0#gid=0
    const req = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`)
    const data = (await req.json()).values;

    const df = new dfd.DataFrame(data.slice(1), { columns: data[0] }).asType(LENGTH, "int32");
    const layout = {
      title: "Progreso",
      xaxis: {
        title: "Fecha",
      },
      yaxis: {
        title: "Páginas",
      },
    };

    const TO_READ = 'Para leer'
    const ALREADY_READ = 'Leído'
    const DATE = 'date'
    const config = {
      columns: [TO_READ, ALREADY_READ],
    };

    const due = df
      .loc({ columns: [DUE_DATE, LENGTH] })
      .groupby([DUE_DATE]).sum()
      .rename({ [LENGTH + '_sum']: TO_READ, [DUE_DATE]: DATE })
      .dropNa()
    const done = df
      .loc({ columns: [DONE_AT, LENGTH] })
      .groupby([DONE_AT]).sum()
      .rename({ [LENGTH + '_sum']: ALREADY_READ, [DONE_AT]: DATE })
      .dropNa()
    const new_df = (dfd.concat({ dfList: [due, done], axis: 0 }).sortValues(DATE).fillNa(0) as dfd.DataFrame)
      .setIndex({ column: DATE, drop: true })
      .cumSum({ axis: 0 });
    new_df.print();
    const isFuture = new dfd.Series(new_df.index.map((x) => new Date(x) > TODAY), { columns: ['isFuture'] });
    (dfd.concat({ dfList: [new_df, isFuture, new dfd.Series(new_df.index, { columns: [DATE] })], axis: 1 }) as dfd.DataFrame)
      .setIndex({ column: DATE, drop: true })
      .apply(([x1, x2, isFuture]: [number, number, boolean]) => (isFuture ? [x1, null, isFuture] : [x1, x2, isFuture]))
      .plot("plot_div").line({ config, layout });
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="plot_div"></div>
    </main>
  );
}
