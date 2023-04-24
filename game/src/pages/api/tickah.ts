import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default (request: NextRequest) => {
  return NextResponse.json({
    name: `Hello, from ${request.url} I'm now an Edge Function!`,
  });
};
