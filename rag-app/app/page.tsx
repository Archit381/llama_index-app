"use client";

import { title, subtitle } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@nextui-org/radio";
import SimpleQuery from "@/components/SimpleQuery";
import UploadedDataQuery from "@/components/UploadedDataQuery";

export default function Home() {
  const [selected, setSelected] = useState("simple-query");

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Explore&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Llama Index&nbsp;</h1>
        <br />
        <h1 className={title()}>with this website</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Start querying with sample or uploaded data.
        </h2>
      </div>

      <div className="flex gap-3 mt-5">
        <RadioGroup
          orientation="horizontal"
          value={selected}
          onValueChange={setSelected}
          color="secondary"
        >
          <Radio value="simple-query" description="Query with the already existing data">Simple Query</Radio>
          <Radio value="query-with-uploaded-data" description="Query with your own uploaded data">
            User-Data Query
          </Radio>
        </RadioGroup>
      </div>

      <div className="flex w-8/12 mt-5">
        {selected === "simple-query" ? <SimpleQuery /> : <UploadedDataQuery />}
      </div>
    </section>
  );
}
