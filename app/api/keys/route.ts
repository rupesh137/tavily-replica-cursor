import { NextResponse } from "next/server";

import { generateKeyPrefix } from "@/lib/keyUtils";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const TABLE = "api_keys";

const mapRecord = (record: any) => ({
  id: record.id,
  label: record.label,
  prefix: record.prefix,
  createdAt: record.created_at,
  lastUsed: record.last_used,
  revoked: record.revoked,
  keyType: record.key_type,
  limitEnabled: record.limit_enabled,
  monthlyLimit: record.monthly_limit,
});

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: data?.map(mapRecord) ?? [],
    });
  } catch (error) {
    console.error("GET /api/keys failed", error);
    return NextResponse.json(
      { error: "Failed to load API keys." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const { label, keyType, limitEnabled, monthlyLimit } =
      await request.json();

    if (!label || !keyType) {
      return NextResponse.json(
        { error: "Label and keyType are required." },
        { status: 400 },
      );
    }

    const payload = {
      label,
      prefix: generateKeyPrefix(),
      key_type: keyType,
      revoked: false,
      limit_enabled: Boolean(limitEnabled),
      monthly_limit:
        limitEnabled && typeof monthlyLimit === "number"
          ? monthlyLimit
          : null,
    };

    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: mapRecord(data) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/keys failed", error);
    return NextResponse.json(
      { error: "Failed to create API key." },
      { status: 500 },
    );
  }
}

