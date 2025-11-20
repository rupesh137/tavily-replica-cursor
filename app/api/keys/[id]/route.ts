import { NextRequest, NextResponse } from "next/server";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = getSupabaseServerClient();
    const { label, revoked, keyType, limitEnabled, monthlyLimit } =
      await request.json();

    const updates: Record<string, unknown> = {};

    if (typeof label === "string") updates.label = label;
    if (typeof revoked === "boolean") updates.revoked = revoked;
    if (typeof keyType === "string") updates.key_type = keyType;
    if (typeof limitEnabled === "boolean") {
      updates.limit_enabled = limitEnabled;
      updates.monthly_limit =
        limitEnabled && typeof monthlyLimit === "number"
          ? monthlyLimit
          : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No updates were provided." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(updates)
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ data: mapRecord(data) });
  } catch (error) {
    console.error("PATCH /api/keys/:id failed", error);
    return NextResponse.json(
      { error: "Failed to update API key." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(TABLE).delete().eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/keys/:id failed", error);
    return NextResponse.json(
      { error: "Failed to delete API key." },
      { status: 500 },
    );
  }
}

