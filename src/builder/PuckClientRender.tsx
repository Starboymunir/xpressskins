"use client";

import { Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { builderConfig } from "./config";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function PuckClientRender({ data }: { data: any }) {
  return <Render config={builderConfig as any} data={data} />;
}
