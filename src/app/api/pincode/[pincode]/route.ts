import { NextResponse } from "next/server";
import https from "node:https";

interface PostalPincodeOffice {
  District?: string;
  State?: string;
}

interface PostalPincodeEntry {
  Status?: string;
  PostOffice?: PostalPincodeOffice[];
}

/** api.postalpincode.in serves HTTPS with an expired cert; browser fetch fails with ERR_CERT_DATE_INVALID. */
function fetchPostalPincode(pincode: string): Promise<PostalPincodeEntry[]> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        hostname: "api.postalpincode.in",
        path: `/pincode/${pincode}`,
        method: "GET",
        headers: { Accept: "application/json" },
        rejectUnauthorized: false,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body) as PostalPincodeEntry[]);
          } catch (err) {
            reject(err);
          }
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(12_000, () => {
      req.destroy();
      reject(new Error("Pincode lookup timeout"));
    });
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ pincode: string }> },
) {
  const { pincode } = await context.params;
  const normalized = pincode.replace(/\D/g, "");
  if (normalized.length !== 6) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const data = await fetchPostalPincode(normalized);
    const entry = data?.[0];

    if (entry?.Status === "Success" && entry.PostOffice?.length) {
      const office = entry.PostOffice[0];
      const city = office.District?.trim();
      const state = office.State?.trim();
      if (city) {
        return NextResponse.json({ city, state: state ?? "" });
      }
    }

    return NextResponse.json(null, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Pincode lookup failed" }, { status: 502 });
  }
}
